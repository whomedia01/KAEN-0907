import { NextRequest, NextResponse } from 'next/server';
import { getGeminiClient } from '@/lib/gemini';
import { Type } from '@google/genai';

export interface EthicsProofreadRequest {
  title: string;
  subtitle?: string;
  summary?: string;
  content: string;
  category?: string;
}

export interface EthicsIssue {
  type: 'forbidden' | 'warning' | 'ethics' | 'ad_risk' | 'bias';
  location: '제목' | '부제' | '요약' | '본문';
  original: string;
  suggestion: string;
  reason: string;
  clause: string;
}

export interface EthicsProofreadResponse {
  ethicsScore: number; // 0 ~ 100
  status: 'safe' | 'caution' | 'violation';
  overallAssessment: string;
  issues: EthicsIssue[];
  correctedTitle: string;
  correctedSubtitle: string;
  correctedSummary: string;
  correctedContent: string;
  recommendations: string[];
}

export async function POST(req: NextRequest) {
  try {
    const body: EthicsProofreadRequest = await req.json();
    const { title, subtitle, summary, content, category } = body;

    if (!title && !content) {
      return NextResponse.json(
        { error: '검사할 기사 제목 또는 본문을 입력해 주세요.' },
        { status: 400 }
      );
    }

    const ai = getGeminiClient();

    const systemInstruction = `당신은 대한민국 최고 권위의 언론 윤리 심의관이자 베테랑 신문 편집국 데스크(Editor)입니다.
한국인터넷신문윤리강령, 한국신문윤리위원회 실천요강, 포털 뉴스 제휴평가위원회 어뷰징 심의 기준 및 저작권·인권보도준칙을 엄격히 준거하여 기사를 교정합니다.

[핵심 심의 및 교정 원칙]
1. 객관성과 정확성: 100%, 무조건, 세계 최초, 혁명적 등 단정적이거나 과장된 표현, 출처 없는 추측(~카더라, 소문에 따르면)을 배격하고 객관적 수식어로 교정합니다.
2. 선정성 및 낚시 방지: 충격, 경악, 발칵, 멘붕, 대참사 등 독자의 클릭을 유도하는 자극적 어뷰징 표제어를 '주목', '파장 확산', '논란 가열' 등 품격 있는 정통 저널리즘 표현으로 교정합니다.
3. 인권 존중 및 차별 금지: 장애인(장님, 귀머거리 등 금지 -> 시각장애인, 청각장애인), 가족형태(결손가정 금지 -> 한부모 가족), 연령/학벌(틀딱, 지잡대 등 전면 금지) 비하 단어를 표준 인권 용어로 정정합니다.
4. 기사와 광고 분리: 지금 바로 구매, 초특가, 최저가, 강력 추천, 원조 등 노골적인 판촉·기사형 광고 문구를 공익적·사실적 보도 문맥으로 전환합니다.
5. AI 및 교육 전문성: '인간 교사 완전 대체' 등 비현실적인 기술 맹신이나 '성적 수직 상승 보장' 등 사교육성 과장 주장을 교육적 보완 및 실증적 맥락으로 다듬습니다.

제공된 원문의 의도와 핵심 팩트는 온전히 보존하되, 어휘와 문장 구조를 완벽한 정통 언론사 표준 양식으로 교정된 대체문(correctedTitle, correctedSubtitle, correctedSummary, correctedContent)을 생성하세요.`;

    const prompt = `다음 기사 원문을 면밀히 검토하고 보도 윤리 위반 요소 분석 및 정밀 교정안을 JSON 형태로 작성해 주십시오.

[기사 메타 정보]
- 카테고리: ${category || '일반'}
- 기사 제목: ${title || '(미입력)'}
- 부제: ${subtitle || '(미입력)'}
- 기사 전문/요약: ${summary || '(미입력)'}

[기사 본문]
${content || '(미입력)'}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.2, // 정밀하고 일관된 교정을 위해 낮은 온도 설정
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ethicsScore: {
              type: Type.INTEGER,
              description: '0부터 100까지의 보도 윤리 준수 점수 (100점: 완벽한 정통 보도, 70점 미만: 심각한 위반 요소 존재)'
            },
            status: {
              type: Type.STRING,
              description: 'safe(안전 85점 이상), caution(주의 70~84점), violation(위반 70점 미만)'
            },
            overallAssessment: {
              type: Type.STRING,
              description: '기사의 전반적인 언론 윤리 준수도 및 톤앤매너 종합 평가 (2~3문장)'
            },
            issues: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: {
                    type: Type.STRING,
                    description: 'forbidden(금지어), warning(주의표현), ethics(윤리위반), ad_risk(기사형광고), bias(편향왜곡)'
                  },
                  location: {
                    type: Type.STRING,
                    description: '제목, 부제, 요약, 본문 중 발생 위치'
                  },
                  original: {
                    type: Type.STRING,
                    description: '문제가 된 원문 단어 또는 구절'
                  },
                  suggestion: {
                    type: Type.STRING,
                    description: '보도 윤리에 부합하는 권장 대체 표현'
                  },
                  reason: {
                    type: Type.STRING,
                    description: '구체적인 지적 및 수정 사유'
                  },
                  clause: {
                    type: Type.STRING,
                    description: '관련 윤리강령 또는 법적 준칙 조항'
                  }
                },
                required: ['type', 'location', 'original', 'suggestion', 'reason', 'clause']
              },
              description: '발견된 세부 문제점 및 1:1 교정 제안 목록'
            },
            correctedTitle: {
              type: Type.STRING,
              description: '보도 윤리 및 표제어 원칙에 맞게 완벽히 교정된 기사 제목'
            },
            correctedSubtitle: {
              type: Type.STRING,
              description: '교정된 부제 (원문에 부제가 없는 경우 핵심 보강 부제 제안)'
            },
            correctedSummary: {
              type: Type.STRING,
              description: '교정된 6하원칙 기반 리드문/전문 요약'
            },
            correctedContent: {
              type: Type.STRING,
              description: '보도 윤리 위반 및 금지어가 모두 정정된 완성형 기사 본문 전문'
            },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '편집국 데스크의 추가 권장사항 리스트 3~4개'
            }
          },
          required: [
            'ethicsScore',
            'status',
            'overallAssessment',
            'issues',
            'correctedTitle',
            'correctedSubtitle',
            'correctedSummary',
            'correctedContent',
            'recommendations'
          ]
        }
      }
    });

    const responseText = response.text?.trim() || '{}';
    const parsed: EthicsProofreadResponse = JSON.parse(responseText);

    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error('Gemini ethics proofread error:', error);
    return NextResponse.json(
      {
        error: error.message || '보도 윤리 AI 교정 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.'
      },
      { status: 500 }
    );
  }
}
