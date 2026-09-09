export const metadata = { title: '개인정보처리방침' };

const sections = [
  {
    title: '1. 개인정보의 처리 목적',
    body: '에듀저널은 기사제보, 보도자료 접수, 문의 응대, 정정·반론 요청 처리, 서비스 개선, 법령상 의무 이행을 위해 필요한 범위에서 개인정보를 처리합니다.'
  },
  {
    title: '2. 수집하는 개인정보 항목',
    body: '문의 또는 제보 과정에서 이름, 소속, 이메일, 연락처, 문의 내용, 첨부 자료, 기사 URL, 접속 로그, 브라우저 정보가 수집될 수 있습니다. 필수 정보가 아닌 항목은 이용자가 제공한 경우에만 처리합니다.'
  },
  {
    title: '3. 개인정보의 보유 및 이용 기간',
    body: '수집된 개인정보는 처리 목적 달성 후 지체 없이 파기합니다. 다만 분쟁 처리, 법령상 보관 의무, 정정·반론 요청 이력 확인이 필요한 경우 관련 법령과 내부 기준에 따라 필요한 기간 동안 보관할 수 있습니다.'
  },
  {
    title: '4. 개인정보의 제3자 제공',
    body: '에듀저널은 이용자의 동의가 있거나 법령에 근거가 있는 경우를 제외하고 개인정보를 외부에 제공하지 않습니다. 보도 사실 확인을 위해 제보자의 동의가 필요한 경우에는 사전에 별도 확인 절차를 거칩니다.'
  },
  {
    title: '5. 개인정보 처리 위탁',
    body: '사이트 운영을 위해 호스팅, 보안, 이메일, 분석 도구 등 외부 서비스를 사용할 수 있습니다. 위탁이 필요한 경우 수탁자와 업무 범위를 확인하고 개인정보가 목적 외로 이용되지 않도록 관리합니다.'
  },
  {
    title: '6. 정보주체의 권리',
    body: '이용자는 본인의 개인정보에 대해 열람, 정정, 삭제, 처리정지를 요청할 수 있습니다. 요청은 문의 페이지를 통해 접수할 수 있으며, 본인 확인 후 관련 법령에 따라 처리합니다.'
  },
  {
    title: '7. 쿠키와 접속 정보',
    body: '사이트 안정성, 방문 통계, 보안 관리를 위해 쿠키와 접속 로그가 생성될 수 있습니다. 이용자는 브라우저 설정을 통해 쿠키 저장을 거부하거나 삭제할 수 있습니다.'
  },
  {
    title: '8. 개인정보 보호책임자',
    body: '개인정보 보호책임자는 박예준입니다. 개인정보 관련 문의, 불만 처리, 피해 구제 요청은 문의 페이지를 통해 접수할 수 있습니다.'
  },
  {
    title: '9. 언론 업무 관련 개인정보 관리',
    body: '기사제보, 보도자료, 정정·반론 신청 과정에서 제공된 정보는 해당 요청을 확인하고 처리하기 위한 범위에서만 이용합니다.'
  }
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-sm font-black tracking-[0.22em] text-brand-gold">PRIVACY POLICY</p>
      <h1 className="mt-2 text-4xl font-black text-brand-navy">개인정보처리방침</h1>
      <p className="mt-5 text-lg leading-9 text-gray-700">
        에듀저널은 독자의 개인정보를 중요하게 생각하며, 개인정보 보호 관련 법령을 준수하기 위해 다음과 같이 개인정보 처리 기준을 안내합니다.
      </p>

      <div className="mt-10 space-y-8 border-t-2 border-brand-navy pt-7">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="text-xl font-black text-brand-navy">{section.title}</h2>
            <p className="mt-3 leading-8 text-gray-700">{section.body}</p>
          </section>
        ))}
      </div>

      <section className="mt-10 border bg-gray-50 p-6 text-sm leading-7 text-gray-700">
        <h2 className="text-xl font-black text-brand-navy">시행 및 변경</h2>
        <p className="mt-3">본 방침은 2026년 6월 24일부터 적용합니다. 법령 또는 서비스 운영 기준이 변경되는 경우 본 페이지를 통해 개정 내용을 고지합니다.</p>
      </section>
    </main>
  );
}
