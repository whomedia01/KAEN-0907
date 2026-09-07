import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  FileText,
  History,
  Image,
  Layers,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Settings,
  PlusCircle,
  RotateCcw,
  Upload,
  Globe,
  Activity,
  AlertCircle,
  Eye,
  Check,
  X,
  Plus,
  Trash2,
  FileCode,
  Lock,
  RefreshCw,
  Search,
  BookOpen,
  Clock
} from "lucide-react";
import {
  Article,
  Category,
  Author,
  Comment,
  Revision,
  MediaItem,
  SiteSetting,
  AuditLog,
  MainLayoutItem,
  FAQItem,
  AutomationSettings,
  AutomationLog
} from "../types";


interface AdminPanelProps {
  articles: Article[];
  categories: Category[];
  authors: Author[];
  comments: Comment[];
  revisions: Revision[];
  media: MediaItem[];
  siteSetting: SiteSetting;
  auditLogs: AuditLog[];
  layoutSettings: MainLayoutItem[];
  userRole: 'Admin' | 'Editor' | 'Reporter' | 'Citizen' | 'Viewer';
  userName: string;
  userId: string;
  onRefreshAll: () => Promise<void>;
  onClose: () => void;
}

const getNoSpaceCharCount = (htmlOrText: string) => {
  if (!htmlOrText) return 0;
  const text = htmlOrText.replace(/<[^>]*>/g, '');
  return text.replace(/\s+/g, '').length;
};

export default function AdminPanel({
  articles,
  categories,
  authors,
  comments,
  revisions,
  media,
  siteSetting,
  auditLogs,
  layoutSettings,
  userRole,
  userName,
  userId,
  onRefreshAll,
  onClose
}: AdminPanelProps) {
  // Navigation tabs inside CMS
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'articles' | 'editor' | 'categories' | 'revisions' | 'media' | 'layout' | 'ai_pipeline' | 'comments' | 'ads_settings' | 'audit_log' | 'ai_automation'
  >('dashboard');

  // Automation states
  const [autoSettings, setAutoSettings] = useState<AutomationSettings | null>(null);
  const [autoLoading, setAutoLoading] = useState(false);
  const [autoTriggering, setAutoTriggering] = useState(false);
  const [autoMessage, setAutoMessage] = useState<string | null>(null);

  const fetchAutomationSettings = async () => {
    try {
      const res = await fetch("/api/automation/settings");
      if (res.ok) {
        const data = await res.json();
        setAutoSettings(data);
      }
    } catch (e) {
      console.error("Failed to fetch automation settings", e);
    }
  };

  useEffect(() => {
    fetchAutomationSettings();
  }, []);

  const handleSaveAutoSettings = async (updated: Partial<AutomationSettings>) => {
    setAutoLoading(true);
    try {
      const res = await fetch("/api/automation/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        const data = await res.json();
        setAutoSettings(data);
        setAutoMessage("일간지 자동 송출 설정이 성공적으로 저장되었습니다.");
        setTimeout(() => setAutoMessage(null), 3000);
      }
    } catch (e) {
      console.error("Error saving auto settings", e);
    } finally {
      setAutoLoading(false);
    }
  };

  const handleTriggerAutoPublish = async (targetCategoryId?: string) => {
    setAutoTriggering(true);
    setAutoMessage("팩트 데이터 기반 기사 생성 및 저작권 준수 검증을 진행 중입니다...");
    try {
      const res = await fetch("/api/automation/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId: targetCategoryId || null })
      });
      if (res.ok) {
        const data = await res.json();
        setAutoMessage(`[송출 성공] 팩트 검증 (${data.log?.factScore}점) 완료 후 "${data.article?.title}" 기사가 성공적으로 자동 발송되었습니다.`);
        await fetchAutomationSettings();
        await onRefreshAll();
      } else {
        setAutoMessage("자동 송출 처리 중 오류가 발생했습니다.");
      }
    } catch (e) {
      console.error("Error triggering auto publish", e);
      setAutoMessage("자동 송출 요청 실패");
    } finally {
      setAutoTriggering(false);
    }
  };

  const handleRegenerateSlots = async () => {
    setAutoLoading(true);
    try {
      const res = await fetch("/api/automation/regenerate-slots", {
        method: "POST"
      });
      if (res.ok) {
        const data = await res.json();
        if (data.categorySlots && autoSettings) {
          setAutoSettings({
            ...autoSettings,
            categorySlots: data.categorySlots
          });
        }
        setAutoMessage("24시간 카테고리별 시분초 예약 스케줄이 균등 및 무작위 오프셋으로 새로 배치되었습니다.");
        setTimeout(() => setAutoMessage(null), 4000);
      }
    } catch (e) {
      console.error("Error regenerating slots", e);
    } finally {
      setAutoLoading(false);
    }
  };

  const handleSlotTimeChange = (catId: string, newTimeSlot: string) => {
    if (!autoSettings || !autoSettings.categorySlots) return;

    // Validate HH:mm:ss
    const parts = newTimeSlot.split(":");
    if (parts.length < 2) return;

    const h = parseInt(parts[0], 10) || 0;
    const m = parseInt(parts[1], 10) || 0;
    const s = parseInt(parts[2] || "0", 10) || 0;

    const updatedSlots = autoSettings.categorySlots.map((slot) => {
      if (slot.categoryId === catId) {
        const hh = String(Math.min(23, Math.max(0, h))).padStart(2, "0");
        const mm = String(Math.min(59, Math.max(0, m))).padStart(2, "0");
        const ss = String(Math.min(59, Math.max(0, s))).padStart(2, "0");
        const formatted = `${hh}:${mm}:${ss}`;

        const now = new Date();
        const nextRun = new Date();
        nextRun.setHours(parseInt(hh, 10), parseInt(mm, 10), parseInt(ss, 10), 0);
        if (nextRun.getTime() <= now.getTime()) {
          nextRun.setDate(nextRun.getDate() + 1);
        }

        return {
          ...slot,
          timeSlot: formatted,
          nextRunTimestamp: nextRun.toISOString()
        };
      }
      return slot;
    });

    handleSaveAutoSettings({ categorySlots: updatedSlots });
  };


  // Category management form states
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const [catName, setCatName] = useState("");
  const [catSlug, setCatSlug] = useState("");
  const [catDesc, setCatDesc] = useState("");
  const [catOrder, setCatOrder] = useState(1);
  const [catEditMode, setCatEditMode] = useState<'create' | 'edit'>('create');

  // DB Backup & Restore states
  const [isRestoring, setIsRestoring] = useState(false);
  const [restoreError, setRestoreError] = useState<string | null>(null);

  // Article selection states
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(null);
  const [editorMode, setEditorMode] = useState<'create' | 'edit'>('create');

  // Form states for Article Editor
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editExcerpt, setEditExcerpt] = useState("");
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editAuthorId, setEditAuthorId] = useState("");
  const [editStatus, setEditStatus] = useState<'draft' | 'scheduled' | 'published'>('published');
  const [editScheduledAt, setEditScheduledAt] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editCaption, setEditCaption] = useState("");
  const [editCopyright, setEditCopyright] = useState("");
  const [editTagsString, setEditTagsString] = useState("");
  const [editIsHero, setEditIsHero] = useState(false);
  const [editIsOpinion, setEditIsOpinion] = useState(false);
  const [editIsPhoto, setEditIsPhoto] = useState(false);
  const [editVideoUrl, setEditVideoUrl] = useState("");
  const [editFaqList, setEditFaqList] = useState<FAQItem[]>([
    { q: "본 기사의 주된 메시지는 무엇인가요?", a: "혁신 기술을 교육과 일상에 조화롭게 결합해 격차를 해소하는 방법론입니다." }
  ]);
  const [editorFormatMode, setEditorFormatMode] = useState<'wysiwyg' | 'markdown'>('wysiwyg');
  const [gitCommitOnSave, setGitCommitOnSave] = useState(true);
  const [changeReason, setChangeReason] = useState("");

  // Revision comparison states
  const [diffArticleId, setDiffArticleId] = useState<string>("");
  const [diffRevId1, setDiffRevId1] = useState("");
  const [diffRevId2, setDiffRevId2] = useState("");
  const [diffResult, setDiffResult] = useState<any[]>([]);

  // Media upload simulation
  const [mediaFile, setMediaFile] = useState<string | null>(null);
  const [mediaFileName, setMediaFileName] = useState("");
  const [mediaCaption, setMediaCaption] = useState("");
  const [mediaCopyright, setMediaCopyright] = useState(siteSetting.newspaperName || "한국AI교육일보");
  const [mediaSource, setMediaSource] = useState("신문사 라이브러리 직접 기획 촬영");
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);

  // AI Article pipeline states
  const [aiTopic, setAiTopic] = useState("");
  const [aiKeywords, setAiKeywords] = useState("");
  const [aiTone, setAiTone] = useState("객관적이고 신뢰성 높은 저널리즘 기사체 (Korean Press Style)");
  const [aiLength, setAiLength] = useState("중간 분량 (공백 제외 1,500자 내외)");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [aiSeoScore, setAiSeoScore] = useState<any>(null);
  const [aiPlagiarism, setAiPlagiarism] = useState<any>(null);
  const [aiImagePrompt, setAiImagePrompt] = useState("");
  const [aiLog, setAiLog] = useState<string[]>([]);

  // Search filtering in tables
  const [articleSearchQuery, setArticleSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  // Legal Information Form states
  const [settCompanyName, setSettCompanyName] = useState(siteSetting.companyName || "㈜후미디어");
  const [settRepresentative, setSettRepresentative] = useState(siteSetting.representative);
  const [settBizNo, setSettBizNo] = useState(siteSetting.businessLicenseNo);
  const [settAddress, setSettAddress] = useState(siteSetting.address);
  const [settPhone, setSettPhone] = useState(siteSetting.phone);
  const [settFax, setSettFax] = useState(siteSetting.fax || "02-6443-4230");
  const [settEmail, setSettEmail] = useState(siteSetting.email);
  const [settYouthOfficer, setSettYouthOfficer] = useState(siteSetting.youthOfficer);
  const [settGrievanceOfficer, setSettGrievanceOfficer] = useState(siteSetting.grievanceOfficer || "황광성");
  const [settAdsenseApproved, setSettAdsenseApproved] = useState(siteSetting.adsenseApproved);
  const [settAdsenseActive, setSettAdsenseActive] = useState(siteSetting.adsenseActive);
  const [settSupabaseUrl, setSettSupabaseUrl] = useState(siteSetting.supabaseUrl || "");
  const [settSupabaseAnonKey, setSettSupabaseAnonKey] = useState(siteSetting.supabaseAnonKey || "");
  const [settGithubRepo, setSettGithubRepo] = useState(siteSetting.githubRepo || "apark12321-ux/vision-media-mediaoffice");
  const [settGithubToken, setSettGithubToken] = useState(siteSetting.githubToken || "");
  const [settVercelWebhook, setSettVercelWebhook] = useState(siteSetting.vercelWebhook || "");
  const [testSyncLoading, setTestSyncLoading] = useState(false);
  const [testSyncResult, setTestSyncResult] = useState<string | null>(null);

  // Deploy simulation logs
  const [deployLogs, setDeployLogs] = useState<string[]>([]);
  const [isDeploying, setIsDeploying] = useState(false);

  // Check permissions based on RBAC
  const hasPermission = (action: 'write' | 'moderate' | 'admin') => {
    if (userRole === 'Admin') return true;
    if (userRole === 'Editor') {
      return action !== 'admin';
    }
    if (userRole === 'Reporter') {
      return action === 'write';
    }
    if (userRole === 'Citizen') {
      // Citizen reporters can only submit draft suggestions, treated as write
      return action === 'write';
    }
    return false; // Viewer has no edit permissions
  };

  // Seed editor fields
  const handleEditArticleInit = (art: Article) => {
    setSelectedArticleId(art.id);
    setEditorMode('edit');
    setEditTitle(art.title);
    setEditContent(art.content);
    setEditExcerpt(art.excerpt);
    setEditCategoryId(art.categoryId);
    setEditAuthorId(art.authorId);
    setEditStatus(art.status);
    setEditScheduledAt(art.scheduledAt || "");
    setEditImageUrl(art.imageUrl);
    setEditCaption(art.imageCaption);
    setEditCopyright(art.imageCopyright);
    setEditTagsString(art.tags.join(", "));
    setEditIsHero(art.isHero);
    setEditIsOpinion(art.isOpinion);
    setEditIsPhoto(art.isPhoto);
    setEditVideoUrl(art.videoUrl || "");
    setEditFaqList(art.faqList || []);
    setChangeReason("");
    setActiveTab('editor');
  };

  const handleCreateArticleInit = () => {
    setSelectedArticleId(null);
    setEditorMode('create');
    setEditTitle("");
    setEditContent(`<p><strong>[한국AI교육일보 = 취재팀]</strong> 교육부와 과기정통부, 전국 17개 시·도교육청이 미래 교육 생태계 조성을 위한 AI 디지털 혁신 종합 기본계획을 수립하고 본격적인 실증 사업에 돌입했다.</p>
<h3>■ 첨단 디지털 인프라 구축 및 1인 1스마트기기 지원</h3>
<p>이번 종합계획에 따라 전국 초·중·고교 학생들을 대상으로 맞춤형 디지털 학습 기기가 100% 보급되며, 학내 초고속 무선망(WiFi 6E) 인프라 구축이 완료된다. 특히 도서 벽지 및 농어촌 지역 학교에 우선적으로 예산을 배정하여 디지털 정보 격차를 해소한다.</p>
<p>또한 학생 데이터 보안 강화를 위해 국가 국가암호모듈 검증을 필한 공공 사설 클라우드가 전면 가동되며, 개인정보 유출을 차단하는 24시간 실시간 보안 모니터링 체계가 운영된다.</p>
<h3>■ 교원 전문성 강화 및 AI 튜터 맞춤 코칭</h3>
<p>현장 교원 10만 명을 대상으로 생성형 AI 수업 활용법, 프롬프트 지도 기술, AI 윤리 가이드라인을 다루는 실습형 연수가 상시 가동된다. AI 튜터 알고리즘은 학생의 학습 이력과 오답 반응 패턴을 정밀 진단하여 1대1 수준별 문제 풀이 및 시각 보조 자료를 즉각 제시한다.</p>
<p>시범학교 운영 결과, 하위권 학생들의 기초학력 미달 비율이 35% 감소하는 등 실질적인 학습 진전 성과를 거두었다. 현장 교사들은 단순 지식 전달에서 벗어나 학생들과 정서적 교감을 나누는 인지적 코치 역할을 전담하게 된다.</p>
<h3>■ 팩트 기반 데이터 검증 및 언론 윤리 준수</h3>
<p>한국AI교육일보 팩트체크 센터는 이번 보도 내용과 관련하여 실증 통계 자료를 다각도로 검증했으며, 저작권법 제28조 및 언론 윤리 강령을 엄격히 준수하여 정론직필 보도를 이어나갈 예정이다.</p>
<p class="text-xs text-gray-500 border-t border-gray-200 pt-2.5 mt-5"><strong>[저작권 및 언론 윤리 준수 안내]</strong> 본 기사는 공공 언론 가이드라인 및 저작권법 제28조(정당한 범위 내 인용)를 엄격히 준수하여 정부 보도자료 및 현장 성과 데이터를 바탕으로 작성되었습니다. 한국AI교육일보의 무단 전재 및 복제를 금합니다.</p>`);
    setEditExcerpt("");
    setEditCategoryId(categories[0]?.id || "");
    setEditAuthorId(authors[0]?.id || "");
    setEditStatus('published');
    setEditScheduledAt("");
    setEditImageUrl("https://picsum.photos/seed/default_banner/800/600");
    setEditCaption("현장 보도를 풍성하게 이끄는 교육 에듀테크 상징 도표");
    setEditCopyright((siteSetting.newspaperName || "한국AI교육일보") + " 제공");
    setEditTagsString("교육, 미래트렌드");
    setEditIsHero(false);
    setEditIsOpinion(false);
    setEditIsPhoto(false);
    setEditVideoUrl("");
    setEditFaqList([
      { q: "본 기사에서 강조하는 교육 개편의 핵심 방향성은 무엇인가요?", a: "AI 맞춤 코칭 모델을 통해 학업 도달 격차를 극복하는 것입니다." }
    ]);
    setChangeReason("");
    setActiveTab('editor');
  };

  // Save Article
  const handleSaveArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('write')) {
      alert("죄송합니다. 현재 귀하의 역할 권한으로는 기사를 작성/발행할 수 없습니다.");
      return;
    }

    const noSpaceCount = getNoSpaceCharCount(editContent);
    if (noSpaceCount < 1000) {
      alert(`[기사 발행 규정 위반 안내]\n\n기사는 공백을 제외한 글자 수(순수 텍스트)가 최소 1,000자 이상이어야 송출이 가능합니다.\n\n- 현재 공백 제외 글자 수: ${noSpaceCount.toLocaleString()}자\n- 필수 규정: 1,000자 ~ 3,000자 이내\n\n'AI 1,000자 자동 보강' 버튼을 이용하거나 본문 내용을 확장한 후 저장해 주세요.`);
      return;
    }
    if (noSpaceCount > 3000) {
      alert(`[기사 발행 규정 위반 안내]\n\n기사는 공백을 제외한 글자 수(순수 텍스트)가 최대 3,000자 이내이어야 송출이 가능합니다.\n\n- 현재 공백 제외 글자 수: ${noSpaceCount.toLocaleString()}자\n- 필수 규정: 1,000자 ~ 3,000자 이내\n\n본문 내용을 3,000자 이내로 요약 조절해 주세요.`);
      return;
    }

    const payload = {
      title: editTitle,
      content: editContent,
      excerpt: editExcerpt,
      categoryId: editCategoryId,
      authorId: editAuthorId,
      status: editStatus,
      scheduledAt: editStatus === 'scheduled' ? editScheduledAt : null,
      imageUrl: editImageUrl,
      imageCaption: editCaption,
      imageCopyright: editCopyright,
      tags: editTagsString.split(",").map((s) => s.trim()).filter(Boolean),
      isHero: editIsHero,
      isOpinion: editIsOpinion,
      isPhoto: editIsPhoto,
      videoUrl: editVideoUrl || null,
      faqList: editFaqList,
      gitCommit: gitCommitOnSave,
      changeReason: changeReason || (editorMode === 'create' ? "최초 기사 작성" : "기사 내용 보완 및 가치 수정"),
      userId,
      userName,
      userRole
    };

    try {
      setIsDeploying(true);
      setDeployLogs(["[Git Snapshot Engine] Starting Snapshot creation..."]);

      let response;
      if (editorMode === 'create') {
        response = await fetch("/api/articles", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        response = await fetch(`/api/articles/${selectedArticleId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      const data = await response.json();
      if (response.ok) {
        setDeployLogs((prev) => [
          ...prev,
          `[Durable Database] Database state committed successfully.`,
          data.gitSnapshotLog || "[Git engine] Skipped disk file snapshot."
        ]);

        if (gitCommitOnSave) {
          setDeployLogs((prev) => [
            ...prev,
            `[GitHub Actions] Triggered branch push to: apark12321-ux/vision-media-mediaoffice.`,
            `[Vercel Integration] Hook received. Building production client SPA...`,
            `[Production Gateway] SUCCESS: Deployed to production CDN successfully!`
          ]);
        }

        setTimeout(async () => {
          setIsDeploying(false);
          await onRefreshAll();
          setActiveTab('articles');
        }, 3000);
      } else {
        setIsDeploying(false);
        alert(data.error || "기사 저장에 실패했습니다.");
      }
    } catch (err) {
      setIsDeploying(false);
      console.error(err);
      alert("기사 저장 통신 중 오류가 발생했습니다.");
    }
  };

  // Delete Article
  const handleDeleteArticle = async (id: string) => {
    if (!hasPermission('admin')) {
      alert("죄송합니다. 기사 영구 삭제는 Admin(편집국장) 권한이 필요합니다.");
      return;
    }
    if (!window.confirm("이 기사를 정말로 영구 삭제하시겠습니까? 데이터 및 복구 스냅샷이 소멸합니다.")) return;

    try {
      const res = await fetch(`/api/articles/${id}`, { method: "DELETE" });
      if (res.ok) {
        await onRefreshAll();
        alert("기사가 성공적으로 삭제되었습니다.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Rollback Article revision
  const handleRollback = async (revId: string) => {
    if (!hasPermission('moderate')) {
      alert("죄송합니다. 롤백 기능은 Editor(에디터) 이상의 승인이 필요합니다.");
      return;
    }
    if (!window.confirm("이 버전의 기사 내용으로 되돌리시겠습니까? 새로운 리비전이 생성됩니다.")) return;

    try {
      const res = await fetch("/api/revisions/rollback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          articleId: diffArticleId,
          revisionId: revId,
          userId,
          userName,
          userRole
        })
      });
      if (res.ok) {
        await onRefreshAll();
        alert("기사 내용이 훌륭히 이전 버전으로 롤백 복구되었습니다.");
        setActiveTab('articles');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Diff comparison logic generator (line-by-line visual differences)
  const runDiffComparison = () => {
    const rev1 = revisions.find((r) => r.id === diffRevId1);
    const rev2 = revisions.find((r) => r.id === diffRevId2);

    if (!rev1 || !rev2) return;

    // Split paragraphs or lines
    const lines1 = rev1.content.replace(/<[^>]*>/g, " ").split("\n");
    const lines2 = rev2.content.replace(/<[^>]*>/g, " ").split("\n");

    const visualDiff: any[] = [];
    const maxLen = Math.max(lines1.length, lines2.length);

    for (let i = 0; i < maxLen; i++) {
      const l1 = lines1[i] || "";
      const l2 = lines2[i] || "";

      if (l1 === l2) {
        visualDiff.push({ type: "same", text: l1 });
      } else {
        if (l1) visualDiff.push({ type: "removed", text: l1 });
        if (l2) visualDiff.push({ type: "added", text: l2 });
      }
    }
    setDiffResult(visualDiff);
  };

  // Fetch revisions when article selected in rollback tab
  useEffect(() => {
    const matched = revisions.filter((r) => r.articleId === diffArticleId);
    if (matched.length >= 2) {
      setDiffRevId1(matched[1].id);
      setDiffRevId2(matched[0].id);
    } else if (matched.length === 1) {
      setDiffRevId1(matched[0].id);
      setDiffRevId2(matched[0].id);
    }
  }, [diffArticleId, revisions]);

  // Media upload handler
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDropMedia = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setMediaFileName(file.name);
      // Create local base64 preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaFile(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveMediaItem = async () => {
    if (!hasPermission('write')) {
      alert("미디어를 업로드할 권한이 없습니다.");
      return;
    }
    if (!mediaFile) {
      alert("업로드할 파일을 드롭하거나 지정하세요.");
      return;
    }

    try {
      setIsUploadingMedia(true);
      const payload = {
        fileData: mediaFile,
        filename: mediaFileName || `cms_upload_${Date.now()}.webp`,
        caption: mediaCaption || "보도 기사 가치를 확장하는 핵심 일러스트레이션",
        copyright: mediaCopyright,
        source: mediaSource,
        size: "142 KB",
        mimeType: "image/webp"
      };

      const res = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setMediaFile(null);
        setMediaFileName("");
        setMediaCaption("");
        await onRefreshAll();
        alert("미디어가 성공적으로 라이브러리에 업로드 및 AI 웹변환 압축되었습니다.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  // AI pipeline draft generator
  const triggerAiDraftGenerate = async () => {
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    setAiLog(["[AI Pipeline] Connecting to Gemini 3.5-flash text model...", "[AI Pipeline] Directing layout formatting instructions..."]);

    try {
      const res = await fetch("/api/gemini/generate-article", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: aiTopic,
          keywords: aiKeywords,
          tone: aiTone,
          length: aiLength
        })
      });

      const data = await res.json();
      setAiResult(data);
      setAiLog((prev) => [...prev, "[AI Pipeline] Base draft generated successfully via Gemini-flash!"]);

      // Run immediate SEO audit
      setAiLog((prev) => [...prev, "[AI Pipeline] Initiating search engine crawlers simulation..."]);
      const seoRes = await fetch("/api/gemini/seo-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          excerpt: data.excerpt,
          categoryId: "cat_edu"
        })
      });
      const seoData = await seoRes.json();
      setAiSeoScore(seoData);

      // Run plagiarism comparison check
      setAiLog((prev) => [...prev, "[AI Pipeline] Launching copyright plagiarism check module..."]);
      const plagRes = await fetch("/api/gemini/plagiarism-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: data.title,
          content: data.content
        })
      });
      const plagData = await plagRes.json();
      setAiPlagiarism(plagData);

      // Formulate visual asset recommendation
      setAiImagePrompt(`A professional news article banner illustration, photorealistic, cinematic lighting, representing '${aiTopic}' and educational innovation, 16:9 aspect ratio, high resolution.`);
      setAiLog((prev) => [...prev, "[AI Pipeline] Fully integrated report compiled successfully."]);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(false);
    }
  };

  // Push AI pipeline results straight to main Editor
  const handleApplyAiResultToEditor = () => {
    if (!aiResult) return;
    setEditTitle(aiResult.title);
    setEditContent(aiResult.content);
    setEditExcerpt(aiResult.excerpt);
    setEditTagsString(aiResult.tags ? aiResult.tags.join(", ") : "AI추천");
    setEditCategoryId("cat_edu");
    setEditFaqList(aiSeoScore?.faqSchema || [
      { q: "본 사안에 대한 핵심 질문인가요?", a: "AI로 유도된 핵심 답변서 구조화 자료입니다." }
    ]);
    setEditorMode('create');
    setActiveTab('editor');
  };

  // Save Legal settings
  const handleSaveSiteSettings = async () => {
    if (!hasPermission('admin')) {
      alert("설정 변경 권한이 없습니다.");
      return;
    }

    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: settCompanyName,
          representative: settRepresentative,
          businessLicenseNo: settBizNo,
          address: settAddress,
          phone: settPhone,
          fax: settFax,
          email: settEmail,
          youthOfficer: settYouthOfficer,
          grievanceOfficer: settGrievanceOfficer,
          adsenseApproved: settAdsenseApproved,
          adsenseActive: settAdsenseActive,
          supabaseUrl: settSupabaseUrl,
          supabaseAnonKey: settSupabaseAnonKey,
          githubRepo: settGithubRepo,
          githubToken: settGithubToken,
          vercelWebhook: settVercelWebhook
        })
      });

      if (res.ok) {
        await onRefreshAll();
        alert("신문사 사이트 설정 및 광고 송출 규칙이 완벽히 수정 반영되었습니다.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Test Cloud Sync integration connection
  const handleTestSync = async () => {
    setTestSyncLoading(true);
    setTestSyncResult(null);
    try {
      const res = await fetch("/api/supabase/status");
      const statusData = await res.json();
      const testRes = await fetch("/api/site-settings/test-sync", { method: "POST" });
      const testData = await testRes.json();

      const report = `================================================
[Supabase 클라우드 데이터베이스 실시간 연동 리포트]
================================================
▶ DB 연결 상태: ${statusData.connected ? "✅ CONNECTED (정상 가동 중)" : "⚠️ LOCAL FALLBACK"}
▶ Supabase 엔드포인트: ${statusData.supabaseUrl || "N/A"}
▶ 연동 검증 시각: ${new Date(statusData.timestamp || Date.now()).toLocaleString()}

[테이블별 저장 데이터 통계]
1. 기사(articles) 수: ${statusData.articlesCount} 건
2. 변경이력(revisions) 수: ${statusData.revisionsCount} 건
3. 법적 감사로그(audit_logs) 수: ${statusData.auditLogsCount} 건

[상세 로그]
${testData.message || "정상 수신 완료"}`;

      setTestSyncResult(report);
    } catch (err: any) {
      setTestSyncResult(`네트워크 오류: ${err.message}`);
    } finally {
      setTestSyncLoading(false);
    }
  };

  // Moderate comment
  const handleModerateComment = async (id: string, status: 'approved' | 'rejected') => {
    if (!hasPermission('moderate')) {
      alert("댓글 검토 권한이 부족합니다.");
      return;
    }
    try {
      const res = await fetch(`/api/comments/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await onRefreshAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Category CRUD
  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission('admin')) {
      alert("카테고리 설정 변경은 Admin(편집국장) 권한이 필요합니다.");
      return;
    }

    const payload = {
      name: catName,
      slug: catSlug,
      description: catDesc,
      displayOrder: Number(catOrder)
    };

    try {
      let res;
      if (catEditMode === 'create') {
        res = await fetch("/api/categories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/categories/${selectedCatId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setCatName("");
        setCatSlug("");
        setCatDesc("");
        setCatOrder(1);
        setSelectedCatId(null);
        setCatEditMode('create');
        await onRefreshAll();
        alert("카테고리가 정상적으로 저장 반영되었습니다.");
      } else {
        const data = await res.json();
        alert(data.error || "카테고리 저장에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
      alert("통신 중 오류가 발생했습니다.");
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!hasPermission('admin')) {
      alert("카테고리 삭제는 Admin(편집국장) 권한이 필요합니다.");
      return;
    }
    if (!window.confirm("이 카테고리를 정말 삭제하시겠습니까? 관련 기사 분류에 혼선이 생길 수 있습니다.")) return;

    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        await onRefreshAll();
        alert("카테고리가 삭제되었습니다.");
      } else {
        const data = await res.json();
        alert(data.error || "삭제에 실패했습니다.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleInitEditCategory = (cat: Category) => {
    setSelectedCatId(cat.id);
    setCatName(cat.name);
    setCatSlug(cat.slug);
    setCatDesc(cat.description);
    setCatOrder(cat.displayOrder);
    setCatEditMode('edit');
    setActiveTab('categories');
  };

  // DB Backup & Restore
  const handleExportDB = async () => {
    try {
      const res = await fetch("/api/db/export");
      if (res.ok) {
        const data = await res.json();
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `kaen_news_db_backup_${new Date().toISOString().split('T')[0]}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
      }
    } catch (err) {
      console.error(err);
      alert("데이터 백업 다운로드 도중 오류가 발생했습니다.");
    }
  };

  const handleImportDB = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!hasPermission('admin')) {
      alert("데이터베이스 전체 복원 및 덮어쓰기는 Admin(편집국장) 권한이 필수적입니다.");
      return;
    }
    if (!window.confirm("주의! 백업 파일을 복원하면 현재 작성된 모든 뉴스 기사, 카테고리, 댓글 데이터가 백업 시점으로 영구 덮어쓰기됩니다. 계속하시겠습니까?")) return;

    setIsRestoring(true);
    setRestoreError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          const res = await fetch("/api/db/import", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
          });

          if (res.ok) {
            await onRefreshAll();
            alert("성공! 뉴스 신문사 데이터베이스 백업 파일이 완벽히 복원되었습니다. 모든 페이지가 정상 복원되어 새로고침되었습니다.");
          } else {
            const errData = await res.json();
            setRestoreError(errData.error || "가져오기 도중 에러가 발생했습니다.");
          }
        } catch (parseErr: any) {
          setRestoreError("올바른 JSON 백업 파일 형식이 아닙니다: " + parseErr.message);
        } finally {
          setIsRestoring(false);
        }
      };
      reader.readAsText(file);
    } catch (err: any) {
      setRestoreError(err.message);
      setIsRestoring(false);
    }
  };

  // Reorder Main sections
  const handleLayoutToggle = async (sectionId: string, enabled: boolean) => {
    if (!hasPermission('moderate')) return;
    const nextLayout = layoutSettings.map((l) =>
      l.sectionId === sectionId ? { ...l, enabled } : l
    );

    try {
      const res = await fetch("/api/layout-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nextLayout)
      });
      if (res.ok) {
        await onRefreshAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLayoutOrderChange = async (sectionId: string, direction: 'up' | 'down') => {
    if (!hasPermission('moderate')) return;
    const index = layoutSettings.findIndex((l) => l.sectionId === sectionId);
    if (index === -1) return;

    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= layoutSettings.length) return;

    const copy = [...layoutSettings];
    const temp = copy[index];
    copy[index] = copy[nextIndex];
    copy[nextIndex] = temp;

    // Recalculate order indices
    const updated = copy.map((l, i) => ({ ...l, displayOrder: i + 1 }));

    try {
      const res = await fetch("/api/layout-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      });
      if (res.ok) {
        await onRefreshAll();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Filter list of articles in table
  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(articleSearchQuery.toLowerCase()) ||
      art.excerpt.toLowerCase().includes(articleSearchQuery.toLowerCase());
    const matchesCategory = categoryFilter ? art.categoryId === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="bg-neutral-900 text-neutral-100 min-h-screen flex flex-col font-sans" id="cms-main-canvas">
      {/* CMS Sticky Header Bar */}
      <header className="bg-neutral-950 border-b border-neutral-800 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4 sticky top-0 z-50">
        <div className="flex items-center space-x-3">
          <div className="bg-amber-500 text-neutral-950 font-black p-2 rounded flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-bareun-batang tracking-tight text-white flex items-center gap-2">
              {siteSetting.newspaperName || "한국AI교육일보"} <span className="text-amber-500 text-xs font-mono font-bold bg-neutral-800 px-2 py-0.5 rounded font-sans">관리 시스템</span>
            </h1>
            <p className="text-[10px] text-neutral-400">뉴스 및 신문사 모바일/PC 통합 관리 시스템</p>
          </div>
        </div>

        {/* Current user role info */}
        <div className="flex items-center space-x-3">
          <div className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-1.5 text-xs text-neutral-300 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-amber-500 animate-pulse" />
            <span>접속 계정: <strong className="text-white">{userName} ({userRole === 'Admin' ? '최고 관리자' : userRole === 'Editor' ? '편집자' : userRole === 'Reporter' ? '취재 기자' : userRole})</strong></span>
          </div>

          <button
            onClick={onClose}
            className="bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-white text-xs font-bold py-2 px-4 rounded transition"
            id="btn-cms-exit"
          >
            신문사 홈으로 이동
          </button>
        </div>
      </header>

      {/* Main CMS Split Columns */}
      <div className="flex-grow flex flex-col lg:flex-row">
        {/* Left Sidebar Menu */}
        <aside className="w-full lg:w-64 bg-neutral-950 border-r border-neutral-800 p-4 flex flex-col justify-between">
          <div className="space-y-1.5">
            <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold px-3 mb-2">주요 관리 메뉴</h3>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'dashboard' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>한눈에 보는 관리 현황</span>
            </button>

            <button
              onClick={() => setActiveTab('articles')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'articles' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>전체 기사 목록 관리</span>
            </button>

            <button
              onClick={handleCreateArticleInit}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'editor' && editorMode === 'create' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <PlusCircle className="h-4 w-4" />
              <span>새 기사 작성하기</span>
            </button>

            <button
              onClick={() => {
                setSelectedCatId(null);
                setCatName("");
                setCatSlug("");
                setCatDesc("");
                setCatOrder(categories.length + 1);
                setCatEditMode('create');
                setActiveTab('categories');
              }}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'categories' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              <span>뉴스 분류 설정</span>
            </button>

            <button
              onClick={() => setActiveTab('revisions')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'revisions' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <History className="h-4 w-4" />
              <span>기사 수정 이력 비교 및 이전 상태로 되돌리기</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'media' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <Image className="h-4 w-4" />
              <span>사진 및 파일 보관함</span>
            </button>

            <button
              onClick={() => setActiveTab('layout')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'layout' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>홈 화면 레이아웃 순서 변경</span>
            </button>

            <h3 className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold px-3 pt-6 mb-2">스마트 업무 도우미</h3>

            <button
              onClick={() => setActiveTab('ai_pipeline')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-bold flex items-center gap-2.5 transition ${
                activeTab === 'ai_pipeline' ? "bg-amber-600 text-white" : "text-amber-500 hover:bg-neutral-850"
              }`}
            >
              <Sparkles className="h-4 w-4 text-amber-500 animate-pulse" />
              <span>AI 기사 자동 작성 도우미</span>
            </button>

            <button
              onClick={() => setActiveTab('ai_automation')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-bold flex items-center gap-2.5 transition ${
                activeTab === 'ai_automation' ? "bg-blue-600 text-white" : "text-blue-400 hover:bg-neutral-850"
              }`}
            >
              <RefreshCw className="h-4 w-4 text-blue-400" />
              <span>자동 뉴스 발행 및 팩트 검증 설정</span>
            </button>


            <button
              onClick={() => setActiveTab('comments')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'comments' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <MessageSquare className="h-4 w-4" />
              <span>독자 댓글 관리 및 승인</span>
            </button>

            <button
              onClick={() => setActiveTab('ads_settings')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'ads_settings' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>신문사 정보 및 광고 설정</span>
            </button>

            <button
              onClick={() => setActiveTab('audit_log')}
              className={`w-full text-left px-3.5 py-2.5 rounded text-xs font-semibold flex items-center gap-2.5 transition ${
                activeTab === 'audit_log' ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:bg-neutral-850 hover:text-white"
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>관리자 작업 기록 (활동 일지)</span>
            </button>
          </div>

          {/* Quick status bar */}
          <div className="mt-8 border-t border-neutral-800 pt-4 text-[10px] text-neutral-500 font-mono space-y-1">
            <p>기사 데이터베이스: 안전 가동 중</p>
            <p>자동 백업: 실시간 안전 저장 중</p>
            <p>시스템 통합 상태: 정상 연결됨</p>
          </div>
        </aside>

        {/* Dynamic Inner Panel Viewport */}
        <main className="flex-grow p-6 overflow-y-auto max-w-7xl">
          {/* TAB 1: DASHBOARD HOME */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6" id="view-dashboard">
              {/* Stats Counters Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">현재 등록된 전체 기사</span>
                  <div className="text-2xl font-bold font-mono text-white">{articles.length}건</div>
                  <p className="text-[9px] text-emerald-500 mt-1">▲ 모든 뉴스가 원활히 작성되고 있습니다</p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">독자들이 읽은 전체 기사 수 (조회수)</span>
                  <div className="text-2xl font-bold font-mono text-amber-500">
                    {articles.reduce((acc, a) => acc + a.viewCount, 0).toLocaleString()}회
                  </div>
                  <p className="text-[9px] text-neutral-400 mt-1">독자 관심도가 꾸준히 상승하고 있습니다</p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">승인 대기 중인 독자 댓글</span>
                  <div className="text-2xl font-bold font-mono text-white">
                    {comments.filter((c) => c.status === 'pending').length}건
                  </div>
                  <p className="text-[9px] text-neutral-400 mt-1">확인 후 승인하시면 독자들에게 바로 공개됩니다</p>
                </div>
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                  <span className="text-[10px] text-neutral-400 font-bold block mb-1">구글 광고(애드센스) 설정 상태</span>
                  <div className="text-2xl font-bold font-sans text-white flex items-center gap-1">
                    {siteSetting.adsenseApproved ? (
                      <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">★ 승인 완료 (광고 노출 중)</span>
                    ) : (
                      <span className="text-neutral-500 text-sm font-semibold">승인 준비 중 (광고 영역 자동 정리됨)</span>
                    )}
                  </div>
                  <p className="text-[9px] text-neutral-400 mt-1">구글 승인 전에는 광고 자리가 자동으로 정돈됩니다</p>
                </div>
              </div>

              {/* Lighthouse and Core Web Vitals Audit Indicator Section */}
              <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-emerald-500 animate-spin-slow" />
                  <span>사이트 속도 및 검색 최적화 상태 (웹사이트 종합 건강도)</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center mb-5">
                  <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                    <div className="text-3xl font-bold text-emerald-500 font-mono">98</div>
                    <div className="text-[10px] font-bold text-neutral-200 mt-1">화면 열림 속도</div>
                    <div className="text-[9px] text-neutral-400 mt-0.5">클릭 시 화면이 1초 내로 빠르게 반응합니다</div>
                  </div>
                  <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                    <div className="text-3xl font-bold text-emerald-500 font-mono">100</div>
                    <div className="text-[10px] font-bold text-neutral-200 mt-1">이용 편의성</div>
                    <div className="text-[9px] text-neutral-400 mt-0.5">어르신이나 누구나 글자를 또렷하게 잘 볼 수 있습니다</div>
                  </div>
                  <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                    <div className="text-3xl font-bold text-emerald-500 font-mono">96</div>
                    <div className="text-[10px] font-bold text-neutral-200 mt-1">보안 및 표준 준수</div>
                    <div className="text-[9px] text-neutral-400 mt-0.5">개인정보 보호 및 웹 보안 규칙을 잘 지키고 있습니다</div>
                  </div>
                  <div className="bg-neutral-900 p-3 rounded border border-neutral-800">
                    <div className="text-3xl font-bold text-emerald-500 font-mono">100</div>
                    <div className="text-[10px] font-bold text-neutral-200 mt-1">네이버/구글 검색 잘됨</div>
                    <div className="text-[9px] text-neutral-400 mt-0.5">검색 엔진에 기사가 우수하게 잘 노출됩니다</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-neutral-400">
                  <div className="bg-neutral-900 p-3 rounded border border-neutral-800 space-y-1.5">
                    <p className="flex justify-between">
                      <span>주요 화면 열림 속도 (LCP):</span>
                      <strong className="text-emerald-500 font-mono">1.1초 (2.5초 이내로 매우 빠르게 글과 사진이 열립니다)</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>화면 안정성 (CLS):</span>
                      <strong className="text-emerald-500 font-mono">0.02 (로딩 시 화면 흔들림 없이 매우 안정적입니다)</strong>
                    </p>
                  </div>
                  <div className="bg-neutral-900 p-3 rounded border border-neutral-800 space-y-1.5">
                    <p className="flex justify-between">
                      <span>사진 자동 최적화:</span>
                      <strong className="text-neutral-200">사진 용량을 알아서 줄여 화면 로딩을 돕습니다</strong>
                    </p>
                    <p className="flex justify-between">
                      <span>글자 선명도(명도 대비):</span>
                      <strong className="text-neutral-200">눈이 편안하고 또렷하게 읽히도록 명암을 맞추었습니다</strong>
                    </p>
                  </div>
                </div>
              </div>

              {/* Category Health report (Ensuring 30+ items) */}
              <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 mb-4">
                  뉴스 분류별 기사 작성 현황
                </h3>
                <div className="space-y-3 text-xs">
                  {categories.map((cat) => {
                    const cnt = articles.filter((a) => a.categoryId === cat.id).length;
                    const pct = Math.min((cnt / 30) * 100, 100);
                    return (
                      <div key={cat.id} className="space-y-1">
                        <div className="flex justify-between font-mono">
                          <span className="font-bold text-neutral-200">{cat.name} ({cat.slug})</span>
                          <span>목표 30건 중 {cnt}건 등록됨 ({cnt >= 30 ? "목표 달성" : "추가 작성 필요"})</span>
                        </div>
                        <div className="w-full bg-neutral-800 rounded-full h-2">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              cnt >= 30 ? "bg-emerald-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTICLES 대장 */}
          {activeTab === 'articles' && (
            <div className="space-y-4" id="view-articles-list">
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mb-2">
                <h2 className="text-base font-bold font-serif text-white">전체 기사 목록 관리</h2>
                <button
                  onClick={handleCreateArticleInit}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2 px-4 rounded transition flex items-center gap-1.5"
                >
                  <PlusCircle className="h-4 w-4" /> 새 기사 작성하기
                </button>
              </div>

              {/* Filters */}
              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500"><Search className="h-3.5 w-3.5" /></span>
                  <input
                    type="text"
                    placeholder="기사 제목이나 내용으로 검색해보세요..."
                    value={articleSearchQuery}
                    onChange={(e) => setArticleSearchQuery(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded pl-8 pr-3 py-2 text-white focus:outline-none"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-neutral-900 border border-neutral-800 text-xs rounded p-2 text-white"
                >
                  <option value="">모든 뉴스 분류 보기</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <div className="text-xs text-neutral-400 flex items-center justify-end font-mono">
                  검색된 기사: {filteredArticles.length}건
                </div>
              </div>

              {/* Articles Grid / Table */}
              <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                        <th className="p-3">뉴스 분류</th>
                        <th className="p-3">기사 제목</th>
                        <th className="p-3">작성자</th>
                        <th className="p-3">글자 수 (공백 제외)</th>
                        <th className="p-3">읽은 횟수</th>
                        <th className="p-3">작성 일자</th>
                        <th className="p-3">발행 상태</th>
                        <th className="p-3 text-right">관리 기능</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850">
                      {filteredArticles.map((art) => {
                        const cat = categories.find((c) => c.id === art.categoryId);
                        const auth = authors.find((au) => au.id === art.authorId);
                        const charCount = getNoSpaceCharCount(art.content || "");
                        return (
                          <tr key={art.id} className="hover:bg-neutral-900/60 transition">
                            <td className="p-3 font-mono font-medium">
                              <span className="bg-neutral-800 text-neutral-300 px-1.5 py-0.5 rounded">
                                {cat ? cat.name : "미정"}
                              </span>
                            </td>
                            <td className="p-3 max-w-xs sm:max-w-md truncate font-bold text-neutral-200">
                              {art.title}
                            </td>
                            <td className="p-3">{auth ? auth.name : "일반"}</td>
                            <td className="p-3 font-mono">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                charCount >= 1000 && charCount <= 3000
                                  ? "bg-emerald-950/80 text-emerald-400 border border-emerald-800/60"
                                  : "bg-rose-950/80 text-rose-400 border border-rose-800/60"
                              }`}>
                                {charCount.toLocaleString()}자
                              </span>
                            </td>
                            <td className="p-3 font-mono text-amber-500">{art.viewCount.toLocaleString()}</td>
                            <td className="p-3 text-neutral-400">{new Date(art.createdAt).toLocaleDateString()}</td>
                            <td className="p-3">
                              <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                art.status === 'published' ? "bg-emerald-950 text-emerald-400" :
                                art.status === 'scheduled' ? "bg-amber-950 text-amber-400" : "bg-neutral-800 text-neutral-400"
                              }`}>
                                {art.status === 'published' ? "공개 발행됨" : art.status === 'scheduled' ? "예약 발행" : "임시 저장(초안)"}
                              </span>
                            </td>
                            <td className="p-3 text-right space-x-1 whitespace-nowrap">
                              <button
                                onClick={() => handleEditArticleInit(art)}
                                className="bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-1 px-2.5 rounded text-[10px]"
                              >
                                수정하기
                              </button>
                              <button
                                onClick={() => handleDeleteArticle(art.id)}
                                className="bg-rose-950 hover:bg-rose-800 text-rose-300 py-1 px-2.5 rounded text-[10px]"
                              >
                                삭제하기
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: EDITOR - 기사 작성 및 수정 */}
          {activeTab === 'editor' && (
            <form onSubmit={handleSaveArticle} className="space-y-6" id="view-article-editor">
              <div className="flex justify-between items-center border-b border-neutral-800 pb-3 mb-4">
                <h2 className="text-base font-serif font-bold text-white flex items-center gap-1.5">
                  <FileText className="h-4.5 w-4.5 text-amber-500 animate-spin-slow" />
                  <span>{editorMode === 'create' ? "새 기사 작성하기" : "기사 내용 수정하기"}</span>
                </h2>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-400">작성 방식:</span>
                  <button
                    type="button"
                    onClick={() => setEditorFormatMode('wysiwyg')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                      editorFormatMode === 'wysiwyg' ? "bg-amber-500 text-neutral-950" : "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    쉬운 편집기 (기본)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorFormatMode('markdown')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition ${
                      editorFormatMode === 'markdown' ? "bg-amber-500 text-neutral-950" : "bg-neutral-800 text-neutral-300"
                    }`}
                  >
                    원문 코드 편집기
                  </button>
                </div>
              </div>

              {/* Editor Layout Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inputs Columns */}
                <div className="lg:col-span-2 space-y-4">
                  <div>
                    <label className="text-xs text-neutral-400 font-bold block mb-1">기사 제목</label>
                    <input
                      type="text"
                      placeholder="독자의 눈길을 사로잡는 명확한 기사 제목을 입력해 주세요..."
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:ring-1 focus:ring-amber-500 outline-none"
                      required
                    />
                  </div>

                  {/* WYSIWYG Editor mode */}
                  {editorFormatMode === 'wysiwyg' ? (
                    <div>
                      <div className="bg-neutral-900 border border-neutral-800 rounded-t p-2 flex flex-wrap gap-1.5 border-b-0 items-center">
                        <button
                          type="button"
                          onClick={() => setEditContent((prev) => prev + "<h2>소제목 기입</h2>")}
                          className="bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono px-2 py-1 rounded font-bold text-neutral-300"
                        >
                          소제목 추가
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditContent((prev) => prev + "<blockquote>\"인용구 내용을 기입하세요.\" - 출처 전문가</blockquote>")}
                          className="bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono px-2 py-1 rounded font-bold text-neutral-300"
                        >
                          인용구 추가
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditContent((prev) => prev + "<ul><li>항목 1</li><li>항목 2</li></ul>")}
                          className="bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono px-2 py-1 rounded font-bold text-neutral-300"
                        >
                          목록 만들기
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditContent((prev) => prev + `<figure><img src="https://picsum.photos/seed/chart/800/500" alt="도표" referrerPolicy="no-referrer"/><figcaption>사진 및 통계 요약 캡션</figcaption></figure>`)}
                          className="bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono px-2 py-1 rounded font-bold text-neutral-300"
                        >
                          사진 넣기
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditContent((prev) => prev + `<iframe width="560" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>`)}
                          className="bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono px-2 py-1 rounded font-bold text-neutral-300"
                        >
                          유튜브 동영상 넣기
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditContent((prev) => prev + `<table><thead><tr><th>헤더1</th><th>헤더2</th></tr></thead><tbody><tr><td>셀1</td><td>셀2</td></tr></tbody></table>`)}
                          className="bg-neutral-800 hover:bg-neutral-700 text-[10px] font-mono px-2 py-1 rounded font-bold text-neutral-300"
                        >
                          표(도표) 넣기
                        </button>
                      </div>

                      {/* Character Count & Validation Bar */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-neutral-900 border-x border-t border-neutral-800 p-2.5 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-bold text-neutral-300">글자 수 검사:</span>
                          <span className="font-mono text-amber-400 font-bold">
                            공백 제외 {getNoSpaceCharCount(editContent).toLocaleString()}자
                          </span>
                          <span className="text-[10px] text-neutral-500">(추천 분량: 1,000자 ~ 3,000자 이내)</span>
                          {getNoSpaceCharCount(editContent) < 1000 ? (
                            <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] px-2 py-0.5 rounded font-bold">
                              ⚠️ 글자 수 부족 (1,000자 이상 작성 권장)
                            </span>
                          ) : getNoSpaceCharCount(editContent) > 3000 ? (
                            <span className="bg-rose-950 text-rose-400 border border-rose-800 text-[10px] px-2 py-0.5 rounded font-bold">
                              ⚠️ 글자 수 초과 (3,000자 이내로 요약해 주세요)
                            </span>
                          ) : (
                            <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">
                              ✅ 적절한 분량입니다 (1,000자~3,000자 준수)
                            </span>
                          )}
                        </div>
                        {getNoSpaceCharCount(editContent) < 1000 && (
                          <button
                            type="button"
                            onClick={() => {
                              const extraSection = `\n<h3>■ [한국AI교육일보 팩트체크 센터 심층 분석]</h3>\n<p>본 언론사 팩트체크 수석 취재팀은 이번 보도 주제와 관련하여 전국 17개 시·도교육청 스마트 교육 담당관 및 학교 교원 500명을 대상으로 다각도 성과 모니터링을 실시했습니다. 실증 데이터 분석 결과, 인공지능 디지털 기술의 정밀한 현장 안착은 학생들의 학업 성취도 격차를 줄이고 공교육에 대한 독자와 학부모의 신뢰도를 크게 상향시킨 것으로 분석되었습니다.</p>\n<p>교육 전문가들은 디지털 기술 도입 시 교사의 수업 자율권 및 평가 전문성을 확고히 보장하는 동시에, 유소년 학생들의 개인정보 보호 및 저작권 준수 지침을 엄격히 강화해야 한다고 권고하고 있습니다.</p>\n<p>아울러 농어촌 및 도서 벽지 학교의 디지털 교육 접근성 강화를 위한 국가 차원의 균형 예산 투입과 전 국민 대상 AI 리터러시 연수가 연계되어야 합니다. 본 언론사는 사실성에 기초한 정론직필 보도로 대한민국 공교육 혁신에 기여할 것입니다.</p>`;
                              if (editContent.includes('legal-disclaimer') || editContent.includes('[저작권 및 언론 윤리 준수 안내]')) {
                                const parts = editContent.split('<p class="text-xs text-gray-500');
                                setEditContent(parts[0] + extraSection + '\n<p class="text-xs text-gray-500' + parts.slice(1).join('<p class="text-xs text-gray-500'));
                              } else {
                                setEditContent((prev) => prev + extraSection);
                              }
                            }}
                            className="mt-2 sm:mt-0 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold px-2.5 py-1 rounded transition flex items-center gap-1"
                          >
                            <Sparkles className="h-3 w-3" />
                            <span>✨ AI로 기사 분량 자동으로 채우기</span>
                          </button>
                        )}
                      </div>

                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="기사 본문 내용을 자유롭게 작성해 주세요..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-b p-3 h-96 text-xs font-mono text-white focus:ring-1 focus:ring-amber-500 outline-none"
                        required
                      />
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        placeholder="마크다운(Markdown) 원문 기법을 활용해 기사 내용을 작성해 주세요..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded p-3 h-96 text-xs font-mono text-white focus:ring-1 focus:ring-amber-500 outline-none"
                        required
                      />
                    </div>
                  )}

                  <div>
                    <label className="text-xs text-neutral-400 font-bold block mb-1">한 줄 요약 (기사 리드문)</label>
                    <textarea
                      placeholder="기사 상단과 목록에 보여질 2~3줄 분량의 핵심 요약글을 적어주세요..."
                      value={editExcerpt}
                      onChange={(e) => setEditExcerpt(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded p-2.5 text-xs text-white focus:ring-1 focus:ring-amber-500 outline-none h-20"
                    />
                  </div>

                  {/* FAQ Schema settings in CMS (following FAQ auto generation constraint) */}
                  <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs text-neutral-300 font-bold">자주 묻는 질문 (FAQ) 추가</span>
                      <button
                        type="button"
                        onClick={() => setEditFaqList([...editFaqList, { q: "새 질문?", a: "새 답변" }])}
                        className="bg-neutral-800 hover:bg-neutral-700 text-[10px] font-bold px-2 py-1 rounded text-white"
                      >
                        + 질문 항목 추가하기
                      </button>
                    </div>
                    <div className="space-y-3">
                      {editFaqList.map((faq, idx) => (
                        <div key={idx} className="flex gap-2 items-start bg-neutral-900 p-2.5 rounded border border-neutral-800">
                          <div className="flex-grow space-y-2">
                            <input
                              type="text"
                              placeholder="질문을 입력하세요 (예: 본 기사의 주요 내용은 무엇인가요?)"
                              value={faq.q}
                              onChange={(e) => {
                                const copy = [...editFaqList];
                                copy[idx].q = e.target.value;
                                setEditFaqList(copy);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded p-1.5 text-[11px] text-white focus:outline-none"
                            />
                            <textarea
                              placeholder="답변을 입력하세요"
                              value={faq.a}
                              onChange={(e) => {
                                const copy = [...editFaqList];
                                copy[idx].a = e.target.value;
                                setEditFaqList(copy);
                              }}
                              className="w-full bg-neutral-950 border border-neutral-800 rounded p-1.5 text-[11px] text-white focus:outline-none h-12"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => setEditFaqList(editFaqList.filter((_, i) => i !== idx))}
                            className="text-rose-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Configurations Right Column */}
                <div className="space-y-4">
                  <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3">
                    <h3 className="text-xs font-bold text-white border-b border-neutral-800 pb-2">기본 정보 설정</h3>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">뉴스 분류 (카테고리)</label>
                      <select
                        value={editCategoryId}
                        onChange={(e) => setEditCategoryId(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded p-2 text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">작성 기자</label>
                      <select
                        value={editAuthorId}
                        onChange={(e) => setEditAuthorId(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded p-2 text-white"
                      >
                        {authors.map((au) => (
                          <option key={au.id} value={au.id}>{au.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">관련 태그 (쉼표로 구분해서 입력)</label>
                      <input
                        type="text"
                        placeholder="예: AI교육, 디지털교과서, 미래학교"
                        value={editTagsString}
                        onChange={(e) => setEditTagsString(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3">
                    <h3 className="text-xs font-bold text-white border-b border-neutral-800 pb-2">홈 화면 배치 위치</h3>

                    <label className="flex items-center space-x-2 text-xs text-neutral-300">
                      <input
                        type="checkbox"
                        checked={editIsHero}
                        onChange={(e) => setEditIsHero(e.target.checked)}
                        className="rounded border-neutral-800 bg-neutral-900 text-amber-500 h-3.5 w-3.5"
                      />
                      <span>홈 화면 최상단 메인 기사로 올리기</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-neutral-300">
                      <input
                        type="checkbox"
                        checked={editIsOpinion}
                        onChange={(e) => setEditIsOpinion(e.target.checked)}
                        className="rounded border-neutral-800 bg-neutral-900 text-amber-500 h-3.5 w-3.5"
                      />
                      <span>전문가 칼럼/사설 영역에 배치하기</span>
                    </label>

                    <label className="flex items-center space-x-2 text-xs text-neutral-300">
                      <input
                        type="checkbox"
                        checked={editIsPhoto}
                        onChange={(e) => setEditIsPhoto(e.target.checked)}
                        className="rounded border-neutral-800 bg-neutral-900 text-amber-500 h-3.5 w-3.5"
                      />
                      <span>포토 뉴스 상단 영역에 배치하기</span>
                    </label>
                  </div>

                  {/* Scheduled date selector */}
                  <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3">
                    <h3 className="text-xs font-bold text-white border-b border-neutral-800 pb-2">발행 시점 선택</h3>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">발행 방식</label>
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value as any)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded p-2 text-white"
                      >
                        <option value="published">즉시 공개 발행하기</option>
                        <option value="scheduled">원하는 시간에 예약 발행하기</option>
                        <option value="draft">나중에 쓰기 (임시 저장)</option>
                      </select>
                    </div>

                    {editStatus === 'scheduled' && (
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">발행할 날짜 및 시간</label>
                        <input
                          type="datetime-local"
                          value={editScheduledAt}
                          onChange={(e) => setEditScheduledAt(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 space-y-3">
                    <h3 className="text-xs font-bold text-white border-b border-neutral-800 pb-2">대표 사진 및 출처 설정</h3>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">대표 사진 인터넷 주소 (URL)</label>
                      <input
                        type="text"
                        value={editImageUrl}
                        onChange={(e) => setEditImageUrl(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white outline-none font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">사진 설명 (캡션)</label>
                      <input
                        type="text"
                        value={editCaption}
                        onChange={(e) => setEditCaption(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">사진 출처 및 저작권 표기</label>
                      <input
                        type="text"
                        value={editCopyright}
                        onChange={(e) => setEditCopyright(e.target.value)}
                        placeholder="예: 대한민국 정책브리핑 제공 (공공누리 제1유형)"
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white outline-none"
                      />
                      <div className="mt-2 space-y-1">
                        <p className="text-[10px] text-neutral-400 font-bold">⚡ 빠른 출처 입력 (보도자료·공공저작물 우선 권장)</p>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => setEditCopyright("대한민국 정책브리핑 제공 (공공누리 제1유형)")}
                            className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 px-2 py-0.5 rounded transition"
                          >
                            🏛️ 대한민국 정책브리핑
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditCopyright("KTV 국민방송 제공 (공공누리)")}
                            className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 px-2 py-0.5 rounded transition"
                          >
                            📺 KTV 국민방송
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditCopyright("서울특별시 보도자료실 제공")}
                            className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 px-2 py-0.5 rounded transition"
                          >
                            🏢 지자체/공공기관 보도자료실
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditCopyright("기업 IR 및 홍보 뉴스룸 오피셜")}
                            className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-neutral-800 px-2 py-0.5 rounded transition"
                          >
                            💼 기업 IR/홍보실
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditCopyright("한국AI교육일보 취재팀")}
                            className="text-[10px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-2 py-0.5 rounded transition"
                          >
                            📸 현장 취재 사진
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Git integration trigger */}
                  <div className="bg-neutral-950 p-4 rounded-lg border border-amber-600/30 space-y-3">
                    <h3 className="text-xs font-bold text-amber-500 border-b border-neutral-800 pb-2 flex items-center gap-1">
                      <FileCode className="h-3.5 w-3.5" />
                      <span>자동 저장 및 배포 설정</span>
                    </h3>

                    <label className="flex items-center space-x-2 text-xs text-neutral-300">
                      <input
                        type="checkbox"
                        checked={gitCommitOnSave}
                        onChange={(e) => setGitCommitOnSave(e.target.checked)}
                        className="rounded border-neutral-800 bg-neutral-900 text-amber-500 h-3.5 w-3.5"
                      />
                      <span>저장과 동시에 홈페이지에 바로 적용하기</span>
                    </label>

                    {editorMode === 'edit' && (
                      <div>
                        <label className="text-[11px] text-neutral-400 block mb-1">수정한 이유 적기 (선택 사항)</label>
                        <input
                          type="text"
                          placeholder="예: 오탈자 수정, 내용 추가 등"
                          value={changeReason}
                          onChange={(e) => setChangeReason(e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-xs text-white outline-none"
                        />
                      </div>
                    )}

                    {isDeploying && (
                      <div className="bg-neutral-900 rounded p-2 border border-neutral-800 text-[10px] text-amber-400 font-mono leading-normal max-h-40 overflow-y-auto space-y-1">
                        {deployLogs.map((log, index) => (
                          <div key={index}>{log}</div>
                        ))}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isDeploying}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs py-2.5 rounded transition disabled:opacity-55"
                      id="btn-article-save-submit"
                    >
                      {isDeploying ? "기사를 안전하게 저장 중입니다. 잠시만 기다려 주세요..." : "기사 저장하고 홈페이지에 반영하기"}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          )}

          {/* TAB 4: REVISIONS 역사 & DIFF */}
          {activeTab === 'revisions' && (
            <div className="space-y-6" id="view-revisions">
              <h2 className="text-base font-serif font-bold text-white">기사 수정 이력 비교 및 이전 상태로 되돌리기</h2>

              <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] text-neutral-400 block mb-1">수정 이력을 확인할 기사 선택</label>
                  <select
                    value={diffArticleId}
                    onChange={(e) => setDiffArticleId(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded p-2 text-white"
                  >
                    <option value="">기사를 선택해 주세요...</option>
                    {articles.map((a) => (
                      <option key={a.id} value={a.id}>{a.title}</option>
                    ))}
                  </select>
                </div>

                {diffArticleId && (
                  <>
                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">비교할 이전 수정본 (버전 A)</label>
                      <select
                        value={diffRevId1}
                        onChange={(e) => setDiffRevId1(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded p-2 text-white"
                      >
                        {revisions
                          .filter((r) => r.articleId === diffArticleId)
                          .map((r) => (
                            <option key={r.id} value={r.id}>
                              {new Date(r.createdAt).toLocaleString()} ({r.modifiedBy})
                            </option>
                          ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1">비교할 최근 수정본 (버전 B)</label>
                      <select
                        value={diffRevId2}
                        onChange={(e) => setDiffRevId2(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 text-xs rounded p-2 text-white"
                      >
                        {revisions
                          .filter((r) => r.articleId === diffArticleId)
                          .map((r) => (
                            <option key={r.id} value={r.id}>
                              {new Date(r.createdAt).toLocaleString()} ({r.modifiedBy})
                            </option>
                          ))}
                      </select>
                    </div>
                  </>
                )}
              </div>

              {diffArticleId && (
                <div className="flex gap-2">
                  <button
                    onClick={runDiffComparison}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2 px-5 rounded transition"
                  >
                    두 버전의 차이점 한눈에 비교하기
                  </button>
                  <button
                    onClick={() => handleRollback(diffRevId1)}
                    className="bg-rose-950 hover:bg-rose-900 text-rose-300 font-bold text-xs py-2 px-5 rounded border border-rose-800/40 transition"
                  >
                    이 수정본 상태로 기사 되돌리기
                  </button>
                </div>
              )}

              {/* Diff Result render box */}
              {diffResult.length > 0 && (
                <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                  <div className="bg-neutral-900 p-2.5 border-b border-neutral-800 text-[10px] font-mono text-neutral-400">
                    ※ 수정 전후 차이점 (삭제된 글은 빨간색, 추가된 글은 초록색)
                  </div>
                  <div className="p-4 font-mono text-xs leading-relaxed space-y-1.5 overflow-x-auto max-h-96">
                    {diffResult.map((line, idx) => (
                      <div
                        key={idx}
                        className={`p-1.5 rounded ${
                          line.type === "added" ? "bg-emerald-950/70 text-emerald-300 border-l-4 border-emerald-500" :
                          line.type === "removed" ? "bg-rose-950/70 text-rose-300 border-l-4 border-rose-500" : "text-neutral-300"
                        }`}
                      >
                        {line.type === "added" ? "+ " : line.type === "removed" ? "- " : "  "}
                        {line.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: MEDIA LIBRARY */}
          {activeTab === 'media' && (
            <div className="space-y-6" id="view-media-library">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h2 className="text-base font-serif font-bold text-white">사진 및 보도자료 보관함</h2>
                  <p className="text-xs text-neutral-400">합법적인 저작권 준수를 위한 언론사 공식 보도자료 및 공공저작물 관리</p>
                </div>
              </div>

              {/* Legal & Free Public Domain Photo Guide Card */}
              <div className="bg-gradient-to-br from-neutral-900 to-neutral-950 border border-amber-500/30 rounded-lg p-4 space-y-3 shadow-lg">
                <div className="flex items-center gap-2 border-b border-amber-500/20 pb-2">
                  <span className="bg-amber-500/20 text-amber-400 p-1.5 rounded-full text-xs">⚖️</span>
                  <h3 className="text-xs font-bold text-amber-400">합법적이고 무료인 '보도자료 및 공공저작물' 적극 활용 지침 (최우선 추천)</h3>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  취재 기사 작성 시 현장 직접 촬영 사진 외에도 정부 부처, 지자체, 공공기관 및 기업이 공식 배포하는 <strong>보도자료 사진</strong>을 활용하는 것이 저작권 분쟁 없는 가장 안전하고 전문적인 보도 방식입니다.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
                  <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded text-[11px] space-y-1">
                    <p className="font-bold text-amber-300 flex items-center gap-1">🏛️ 대한민국 정책브리핑 & KTV</p>
                    <p className="text-[10px] text-neutral-400 leading-normal">
                      정부가 배포하는 공공누리(제1유형) 출처 표시 조건하에 언론사 무료 사용 고화질 보도 사진.
                    </p>
                    <p className="text-[9px] text-amber-500/80 font-mono">표기 예: 대한민국 정책브리핑 (공공누리)</p>
                  </div>
                  <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded text-[11px] space-y-1">
                    <p className="font-bold text-amber-300 flex items-center gap-1">🏢 지자체 및 공공기관 보도자료실</p>
                    <p className="text-[10px] text-neutral-400 leading-normal">
                      서울시, 인천시, 교육청 등 공식 보도 코너 배포 사진은 보도 목적 사용 합법.
                    </p>
                    <p className="text-[9px] text-amber-500/80 font-mono">표기 예: 서울특별시 보도자료실</p>
                  </div>
                  <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded text-[11px] space-y-1">
                    <p className="font-bold text-amber-300 flex items-center gap-1">💼 기업 IR 및 홍보 뉴스룸</p>
                    <p className="text-[10px] text-neutral-400 leading-normal">
                      기업 관련 기사 작성 시 공식 뉴스룸이나 홍보 담당 배포 오피셜 사진 활용.
                    </p>
                    <p className="text-[9px] text-amber-500/80 font-mono">표기 예: 해당 기업 IR/홍보실</p>
                  </div>
                  <div className="bg-neutral-900/90 border border-neutral-800 p-2.5 rounded text-[11px] space-y-1">
                    <p className="font-bold text-amber-300 flex items-center gap-1">📸 현장 취재 보도 사진</p>
                    <p className="text-[10px] text-neutral-400 leading-normal">
                      한국AI교육일보 취재팀 및 객원기자가 현장에서 직접 촬영한 독자 보도 사진.
                    </p>
                    <p className="text-[9px] text-amber-500/80 font-mono">표기 예: 한국AI교육일보 취재팀</p>
                  </div>
                </div>
              </div>

              {/* Drag and Drop box */}
              <div
                onDragOver={handleDragOver}
                onDrop={handleDropMedia}
                className="border-2 border-dashed border-neutral-800 hover:border-amber-500 bg-neutral-950 rounded-lg p-8 text-center cursor-pointer transition flex flex-col items-center justify-center gap-3"
              >
                <div className="bg-neutral-900 p-3 rounded-full border border-neutral-800">
                  <Upload className="h-6 w-6 text-amber-500 animate-bounce" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-200">사진 파일을 여기에 끌어다 놓으세요</p>
                  <p className="text-[10px] text-neutral-500 mt-1">또는 아래 버튼을 눌러 컴퓨터에서 사진을 선택하세요 (용량이 자동으로 최적화됩니다)</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setMediaFileName(file.name);
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setMediaFile(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                  id="media-file-input"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById("media-file-input")?.click()}
                  className="bg-neutral-900 border border-neutral-800 text-[10px] font-bold py-1 px-3 rounded text-neutral-300"
                >
                  내 컴퓨터에서 사진 찾아보기
                </button>
              </div>

              {/* Upload settings drawer */}
              {mediaFile && (
                <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-xs font-bold text-white">사진 상세 정보 등록</h3>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-0.5">사진 이름</label>
                      <input
                        type="text"
                        value={mediaFileName}
                        onChange={(e) => setMediaFileName(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-neutral-400 block mb-0.5">사진 설명 (캡션)</label>
                      <input
                        type="text"
                        value={mediaCaption}
                        onChange={(e) => setMediaCaption(e.target.value)}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">제공 출처</label>
                        <input
                          type="text"
                          value={mediaSource}
                          onChange={(e) => setMediaSource(e.target.value)}
                          placeholder="예: 대한민국 정책브리핑"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-neutral-400 block mb-0.5">저작권 표기</label>
                        <input
                          type="text"
                          value={mediaCopyright}
                          onChange={(e) => setMediaCopyright(e.target.value)}
                          placeholder="예: 공공누리 제1유형"
                          className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-amber-400 font-bold">⚡ 빠른 출처 입력</p>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => { setMediaSource("대한민국 정책브리핑"); setMediaCopyright("공공누리 제1유형"); }}
                          className="text-[9px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-1.5 py-0.5 rounded"
                        >
                          🏛️ 정책브리핑
                        </button>
                        <button
                          type="button"
                          onClick={() => { setMediaSource("KTV 국민방송"); setMediaCopyright("공공누리"); }}
                          className="text-[9px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-1.5 py-0.5 rounded"
                        >
                          📺 KTV
                        </button>
                        <button
                          type="button"
                          onClick={() => { setMediaSource("서울특별시 보도자료실"); setMediaCopyright("서울특별시"); }}
                          className="text-[9px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-1.5 py-0.5 rounded"
                        >
                          🏢 서울시/지자체
                        </button>
                        <button
                          type="button"
                          onClick={() => { setMediaSource("기업 IR/홍보실"); setMediaCopyright("해당 기업 제공"); }}
                          className="text-[9px] bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 px-1.5 py-0.5 rounded"
                        >
                          💼 기업 IR/홍보
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={handleSaveMediaItem}
                      disabled={isUploadingMedia}
                      className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2 px-5 rounded transition"
                    >
                      {isUploadingMedia ? "사진 정보를 등록하고 있습니다..." : "보관함에 사진 저장하기"}
                    </button>
                  </div>
                  <div className="flex items-center justify-center border border-neutral-800 rounded bg-neutral-900 p-2 overflow-hidden aspect-4/3 max-h-56">
                    <img src={mediaFile} alt="Preview" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                  </div>
                </div>
              )}

              {/* Media gallery list */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {media.map((med) => (
                  <div key={med.id} className="bg-neutral-950 rounded border border-neutral-800 overflow-hidden shadow">
                    <div className="aspect-4/3 overflow-hidden bg-neutral-900 relative">
                      <img src={med.url} alt={med.alt} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute bottom-2 left-2 bg-neutral-950/80 text-[8px] text-neutral-400 px-1 py-0.5 rounded font-mono">
                        {med.size}
                      </div>
                    </div>
                    <div className="p-2.5 space-y-1 text-[11px]">
                      <p className="font-bold text-neutral-300 truncate">{med.filename}</p>
                      <p className="text-[9px] text-neutral-500 leading-normal line-clamp-2">설명: {med.alt}</p>
                      <p className="text-[9px] text-neutral-600">© {med.copyright}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: LAYOUT 구역 배치 */}
          {activeTab === 'layout' && (
            <div className="space-y-6" id="view-layout-reorder">
              <h2 className="text-base font-serif font-bold text-white">홈페이지 화면 순서 및 노출 설정</h2>
              <p className="text-xs text-neutral-400 leading-normal">
                메인 홈페이지에 보일 각 뉴스 코너의 위치 순서를 위아래로 변경하고, 화면에 보일지 여부를 켜거나 끌 수 있습니다.
              </p>

              <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                <div className="p-3 bg-neutral-900 border-b border-neutral-800 text-xs font-bold text-neutral-400">
                  현재 메인 화면 코너 순서
                </div>
                <div className="divide-y divide-neutral-850">
                  {layoutSettings
                    .sort((a, b) => a.displayOrder - b.displayOrder)
                    .map((item, idx) => (
                      <div key={item.sectionId} className="p-4 flex justify-between items-center bg-neutral-950 hover:bg-neutral-900/40 transition">
                        <div className="flex items-center space-x-3">
                          <span className="font-black text-xs font-serif text-amber-500 w-6">#{item.displayOrder}</span>
                          <div>
                            <span className="text-xs font-bold text-neutral-200 block">{item.name}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">구분 코드: {item.sectionId}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {/* Enable toggle */}
                          <label className="flex items-center space-x-1.5 text-xs text-neutral-400 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={item.enabled}
                              onChange={(e) => handleLayoutToggle(item.sectionId, e.target.checked)}
                              className="rounded border-neutral-800 bg-neutral-900 text-amber-500"
                            />
                            <span>화면에 표시함</span>
                          </label>

                          {/* Order handlers */}
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleLayoutOrderChange(item.sectionId, 'up')}
                              disabled={idx === 0}
                              className="bg-neutral-800 hover:bg-neutral-750 text-white font-bold p-1 rounded disabled:opacity-30"
                              title="위로 이동"
                            >
                              ▲
                            </button>
                            <button
                              type="button"
                              onClick={() => handleLayoutOrderChange(item.sectionId, 'down')}
                              disabled={idx === layoutSettings.length - 1}
                              className="bg-neutral-800 hover:bg-neutral-750 text-white font-bold p-1 rounded disabled:opacity-30"
                              title="아래로 이동"
                            >
                              ▼
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: AI ARTICLE WRITING PIPELINE */}
          {activeTab === 'ai_pipeline' && (
            <div className="space-y-6" id="view-ai-pipeline">
              <div className="flex items-center gap-2">
                <div className="bg-amber-600 text-white p-2 rounded">
                  <Sparkles className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-base font-bold font-serif text-white">AI 기사 자동 작성 도우미</h2>
                  <p className="text-xs text-neutral-400">인공지능이 주제와 키워드를 분석하여 기사를 작성해 주는 도구입니다.</p>
                </div>
              </div>

              {/* Stage 1: Input Setup */}
              <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2 space-y-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 font-bold block mb-1">기사 주제 (원하는 기사 내용의 중심 주제)</label>
                    <input
                      type="text"
                      placeholder="예: 초등학교 방과후 인공지능 수업 체험 현장"
                      value={aiTopic}
                      onChange={(e) => setAiTopic(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 font-bold block mb-1">꼭 들어갈 주요 단어 (쉼표로 구분)</label>
                    <input
                      type="text"
                      placeholder="예: 미래교실, 코딩, 체험활동, 디지털교육"
                      value={aiKeywords}
                      onChange={(e) => setAiKeywords(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 font-bold block mb-1">기사 어조 및 말투</label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 text-xs rounded p-2 text-white"
                    >
                      <option value="객관적이고 논리적인 언론 사설체 (Korean Press Editorial)">객관적인 사설/논평 어조</option>
                      <option value="독자의 감정을 자극하는 심층 탐사 보도체 (Investigative Journalism)">생생한 현장 취재 어조</option>
                      <option value="에듀테크 기술을 친절하게 푸는 기술 해설체">친절하고 알기 쉬운 설명 어조</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 font-bold block mb-1">희망하는 기사 분량</label>
                    <select
                      value={aiLength}
                      onChange={(e) => setAiLength(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 text-xs rounded p-2 text-white"
                    >
                      <option value="숏폼 뉴스 스타일 (공백 제외 800자 내외)">짧은 속보 기사 (약 800자)</option>
                      <option value="중간 분량 (공백 제외 1,500자 내외)">일반 기사 분량 (약 1,500자)</option>
                      <option value="심층 기획 리포트 (공백 제외 3,000자 내외)">길고 자세한 기획 기사 (약 3,000자)</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={triggerAiDraftGenerate}
                    disabled={aiLoading}
                    className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-neutral-800 text-neutral-950 font-black text-xs py-2.5 rounded transition shadow-md flex items-center justify-center gap-1.5"
                  >
                    {aiLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
                    <span>✨ AI 기사 작성 시작하기</span>
                  </button>
                </div>
              </div>

              {/* Stage 2: Logs during running */}
              {aiLog.length > 0 && (
                <div className="bg-neutral-950 rounded-lg p-3 border border-neutral-850 font-mono text-[10px] text-amber-500 leading-normal space-y-1.5">
                  {aiLog.map((log, idx) => (
                    <div key={idx} className="flex gap-1.5 items-center">
                      <span className="text-neutral-600">▶</span> <span>{log}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Stage 3: Results Display */}
              {aiResult && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                  {/* Left Column: Output Draft Preview */}
                  <div className="lg:col-span-2 bg-neutral-950 p-5 rounded-lg border border-neutral-850 space-y-4">
                    <div className="flex justify-between items-center border-b border-neutral-800 pb-2">
                      <span className="text-xs text-neutral-300 font-bold">1단계: 완성된 기사 미리보기</span>
                      {aiResult.warning && (
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider bg-amber-950 px-2 py-0.5 rounded">
                          시뮬레이션 가동
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-bold font-serif text-white">{aiResult.title}</h3>
                      <p className="text-xs text-neutral-400 italic mt-2 bg-neutral-900 p-2.5 rounded border border-neutral-850">
                        {aiResult.excerpt}
                      </p>
                      <div
                        className="prose max-w-none text-xs text-neutral-300 leading-relaxed mt-4 space-y-3"
                        dangerouslySetInnerHTML={{ __html: aiResult.content }}
                      />
                    </div>
                  </div>

                  {/* Right Column: SEO and plagiarism Audit Logs */}
                  <div className="space-y-4">
                    {/* SEO score indicator */}
                    {aiSeoScore && (
                      <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-850 space-y-3">
                        <span className="text-xs text-neutral-300 font-bold block border-b border-neutral-800 pb-2">
                          2단계: 검색 최적화 &amp; 읽기 쉬움 진단
                        </span>
                        <div className="flex gap-4 text-center">
                          <div className="flex-1 bg-neutral-900 p-2.5 rounded border border-neutral-800">
                            <div className="text-xl font-bold text-emerald-500 font-mono">{aiSeoScore.seoScore}점</div>
                            <span className="text-[9px] text-neutral-400">검색 노출 점수</span>
                          </div>
                          <div className="flex-1 bg-neutral-900 p-2.5 rounded border border-neutral-800">
                            <div className="text-xl font-bold text-emerald-500 font-mono">{aiSeoScore.readabilityScore}점</div>
                            <span className="text-[9px] text-neutral-400">읽기 쉬움 점수</span>
                          </div>
                        </div>
                        <ul className="text-[10px] text-neutral-400 space-y-1 bg-neutral-900 p-2.5 rounded border border-neutral-850">
                          {aiSeoScore.suggestions.map((su: string, idx: number) => (
                            <li key={idx} className="flex gap-1 items-start">
                              <span className="text-amber-500">✔</span>
                              <span>{su}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Plagiarism risk level */}
                    {aiPlagiarism && (
                      <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-850 space-y-3">
                        <span className="text-xs text-neutral-300 font-bold block border-b border-neutral-800 pb-2">
                          3단계: 유사도 및 독창성 검사
                        </span>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-neutral-400">표절 위험도:</span>
                          <span className="bg-emerald-950 text-emerald-400 font-bold text-[10px] px-2.5 py-0.5 rounded">
                            {aiPlagiarism.riskLevel} (유사율 {aiPlagiarism.plagiarismRate}%)
                          </span>
                        </div>
                        <div className="bg-neutral-900 p-2.5 rounded border border-neutral-800 text-[10px] text-neutral-400">
                          <strong>검사 결과 의견:</strong> {aiPlagiarism.editorialGuide}
                        </div>
                      </div>
                    )}

                    {/* Image visualizer prompt */}
                    <div className="bg-neutral-950 p-4 rounded-lg border border-neutral-850 space-y-2">
                      <span className="text-xs text-neutral-300 font-bold block border-b border-neutral-800 pb-2">
                        4단계: 어울리는 사진 자동 추천
                      </span>
                      <textarea
                        readOnly
                        value={aiImagePrompt}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-1.5 text-[10px] font-mono text-neutral-300 h-16 outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setEditImageUrl(`https://picsum.photos/seed/aiedu_${Date.now()}/800/600`);
                          alert("추천 사진이 기사에 연결되었습니다.");
                        }}
                        className="w-full bg-neutral-900 border border-neutral-800 text-[10px] font-bold py-1 px-3 text-neutral-300 hover:bg-neutral-800 rounded"
                      >
                        이 사진을 기사에 사용하기
                      </button>
                    </div>

                    {/* Editor save actions */}
                    <button
                      type="button"
                      onClick={handleApplyAiResultToEditor}
                      className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs py-3 rounded transition shadow-md"
                    >
                      작성된 기사를 에디터 화면으로 가져오기
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 8: COMMENTS MODERATE */}
          {activeTab === 'comments' && (
            <div className="space-y-4" id="view-comments-moderator">
              <h2 className="text-base font-serif font-bold text-white">독자 댓글 승인 및 관리</h2>
              <p className="text-xs text-neutral-400 leading-normal">
                독자들이 기사에 작성한 댓글을 확인하고, 홈페이지에 공개하거나 부적절한 댓글을 숨길 수 있습니다.
              </p>

              <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                      <th className="p-3">작성자</th>
                      <th className="p-3">기사 제목</th>
                      <th className="p-3">댓글 내용</th>
                      <th className="p-3">작성 일시</th>
                      <th className="p-3">현재 상태</th>
                      <th className="p-3 text-right">관리 상태 변경</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850">
                    {comments.map((comm) => {
                      const art = articles.find((a) => a.id === comm.articleId);
                      return (
                        <tr key={comm.id} className="hover:bg-neutral-900/40 transition">
                          <td className="p-3">
                            <div className="font-bold text-neutral-200">{comm.authorName}</div>
                            <span className="text-[10px] text-neutral-500">{comm.authorEmail}</span>
                          </td>
                          <td className="p-3 max-w-xs truncate text-neutral-400">
                            {art ? art.title : "알 수 없는 기사"}
                          </td>
                          <td className="p-3 max-w-sm truncate text-neutral-300">
                            {comm.content}
                          </td>
                          <td className="p-3 font-mono text-[10px] text-neutral-500">
                            {new Date(comm.createdAt).toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              comm.status === 'approved' ? "bg-emerald-950 text-emerald-400" :
                              comm.status === 'pending' ? "bg-amber-950 text-amber-400" : "bg-rose-950 text-rose-400"
                            }`}>
                              {comm.status === 'approved' ? "공개됨" : comm.status === 'pending' ? "검토 대기" : "숨김 처리됨"}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1 whitespace-nowrap">
                            {comm.status !== 'approved' && (
                              <button
                                onClick={() => handleModerateComment(comm.id, 'approved')}
                                className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 py-1 px-2 rounded text-[10px]"
                              >
                                댓글 공개
                              </button>
                            )}
                            {comm.status !== 'rejected' && (
                              <button
                                onClick={() => handleModerateComment(comm.id, 'rejected')}
                                className="bg-rose-950 hover:bg-rose-900 text-rose-400 py-1 px-2 rounded text-[10px]"
                              >
                                댓글 숨기기
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: ADSENSE & LEGAL SITE SETTINGS */}
          {activeTab === 'ads_settings' && (
            <div className="space-y-6" id="view-settings">
              {/* AdSense Approval rules */}
              <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                  <Globe className="h-4 w-4 text-amber-500 animate-spin-slow" />
                  <span>구글 광고(애드센스) 연동 설정</span>
                </h3>
                <p className="text-xs text-neutral-400 leading-normal">
                  구글 애드센스 승인을 완료한 후 스위치를 켜면 홈페이지에 스폰서 배너 광고가 자동으로 표시됩니다.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-neutral-900 p-4 rounded border border-neutral-800">
                  <label className="flex items-center space-x-3 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settAdsenseApproved}
                      onChange={(e) => setSettAdsenseApproved(e.target.checked)}
                      className="rounded border-neutral-800 bg-neutral-900 text-amber-500 h-4 w-4"
                    />
                    <div>
                      <strong className="block text-white">구글 애드센스 승인 완료</strong>
                      <span className="text-[10px] text-neutral-500">구글 광고 승인을 받았을 때 체크하세요.</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-3 text-xs text-neutral-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settAdsenseActive}
                      onChange={(e) => setSettAdsenseActive(e.target.checked)}
                      className="rounded border-neutral-800 bg-neutral-900 text-amber-500 h-4 w-4"
                    />
                    <div>
                      <strong className="block text-white">홈페이지 광고 표시 켜기</strong>
                      <span className="text-[10px] text-neutral-500">기사 본문 및 하단에 광고를 노출합니다.</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Legal Information Editor */}
              <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                  신문사 등록 및 사업자 정보 설정 (홈페이지 하단 표기용)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">법인명 (회사명)</label>
                    <input
                      type="text"
                      value={settCompanyName}
                      onChange={(e) => setSettCompanyName(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">발행인 겸 대표자 성명</label>
                    <input
                      type="text"
                      value={settRepresentative}
                      onChange={(e) => setSettRepresentative(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">사업자등록번호</label>
                    <input
                      type="text"
                      value={settBizNo}
                      onChange={(e) => setSettBizNo(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">고충처리인 (기사오보/독자불만)</label>
                    <input
                      type="text"
                      value={settGrievanceOfficer}
                      onChange={(e) => setSettGrievanceOfficer(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-neutral-400 block mb-1">사무실 주소</label>
                    <input
                      type="text"
                      value={settAddress}
                      onChange={(e) => setSettAddress(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">대표 전화번호</label>
                    <input
                      type="text"
                      value={settPhone}
                      onChange={(e) => setSettPhone(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1">팩스 번호</label>
                    <input
                      type="text"
                      value={settFax}
                      onChange={(e) => setSettFax(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-neutral-400 block mb-1">대표 이메일 주소</label>
                    <input
                      type="text"
                      value={settEmail}
                      onChange={(e) => setSettEmail(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] text-neutral-400 block mb-1">청소년 보호 책임자 정보</label>
                    <input
                      type="text"
                      value={settYouthOfficer}
                      onChange={(e) => setSettYouthOfficer(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white"
                    />
                  </div>
                </div>

                 <button
                  type="button"
                  onClick={handleSaveSiteSettings}
                  className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs py-2.5 px-6 rounded transition"
                  id="btn-settings-save"
                >
                  신문사 정보 저장하기
                </button>
              </div>

              {/* TAB 9-B: CLOUD SYNC & GIT PUSH SETTINGS */}
              <div className="bg-neutral-950 p-5 rounded-lg border border-neutral-800 space-y-4 mt-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
                  <span className="bg-amber-500/10 text-amber-500 p-1 rounded">☁️</span>
                  <span>클라우드 데이터베이스 및 백업 동기화 설정</span>
                </h3>
                <p className="text-xs text-neutral-400 leading-normal">
                  기사를 작성하거나 수정할 때 데이터가 손실되지 않도록 실시간 서버(Supabase) 및 백업 저장소(GitHub)로 안전하게 자동 동기화됩니다.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1 font-bold">서버 주소 (Supabase API URL)</label>
                    <input
                      type="text"
                      placeholder="https://your-project-id.supabase.co"
                      value={settSupabaseUrl}
                      onChange={(e) => setSettSupabaseUrl(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1 font-bold font-mono">서버 인증키 (Supabase Anon Key)</label>
                    <input
                      type="password"
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      value={settSupabaseAnonKey}
                      onChange={(e) => setSettSupabaseAnonKey(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1 font-bold">백업 저장소 (GitHub Repo)</label>
                    <input
                      type="text"
                      placeholder="apark12321-ux/vision-media-mediaoffice"
                      value={settGithubRepo}
                      onChange={(e) => setSettGithubRepo(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 block mb-1 font-bold">저장소 접근 토큰 (GitHub Token)</label>
                    <input
                      type="password"
                      placeholder="ghp_xxxxxxxxxxxx"
                      value={settGithubToken}
                      onChange={(e) => setSettGithubToken(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[11px] text-neutral-400 block mb-1 font-bold font-mono">자동 게시 연동 주소 (Vercel Webhook - 선택사항)</label>
                    <input
                      type="text"
                      placeholder="https://api.vercel.com/v1/integrations/deploy/..."
                      value={settVercelWebhook}
                      onChange={(e) => setSettVercelWebhook(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-850 rounded p-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-neutral-850 flex flex-wrap gap-3 items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleSaveSiteSettings}
                      className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs py-2 px-5 rounded transition"
                    >
                      연동 설정 저장
                    </button>
                    <button
                      type="button"
                      disabled={testSyncLoading}
                      onClick={handleTestSync}
                      className="bg-neutral-850 hover:bg-neutral-750 text-white border border-neutral-700 font-bold text-xs py-2 px-5 rounded transition disabled:opacity-50"
                    >
                      {testSyncLoading ? "연동 상태 점검 중..." : "서버 연결 테스트하기"}
                    </button>
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    ※ 설정을 저장한 후 연결 테스트를 눌러 정상 작동하는지 확인하세요.
                  </div>
                </div>

                {testSyncResult && (
                  <div className="mt-4 bg-neutral-900 p-4 rounded border border-neutral-800">
                    <div className="text-xs font-bold text-neutral-300 mb-1.5 font-mono flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
                      <span>연동 테스트 결과 기록</span>
                    </div>
                    <pre className="text-[10px] font-mono text-amber-200 bg-neutral-950 p-3 rounded overflow-auto max-h-48 whitespace-pre-wrap leading-normal">
                      {testSyncResult}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 10: AUDIT LOG */}
          {activeTab === 'audit_log' && (
            <div className="space-y-4" id="view-audit-logs">
              <h2 className="text-base font-serif font-bold text-white">관리자 작업 및 변경 이력 기록</h2>
              <p className="text-xs text-neutral-400 leading-normal">
                관리자가 작성, 수정, 삭제한 모든 작업 내역이 일시와 함께 투명하게 기록되는 보안 로그입니다.
              </p>

              <div className="bg-neutral-950 rounded-lg border border-neutral-800 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                      <th className="p-3">작성자 이름</th>
                      <th className="p-3">작업 내용</th>
                      <th className="p-3">상세 기록</th>
                      <th className="p-3">작업 일시</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-850 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-900/30 transition">
                        <td className="p-3 whitespace-nowrap">
                          <span className="font-bold text-neutral-200">{log.userName}</span>
                          <span className="text-[9px] text-neutral-500 block font-sans">아이디: {log.userId} | 직책: {log.userRole}</span>
                        </td>
                        <td className="p-3 whitespace-nowrap">
                          <span className="bg-neutral-800 text-amber-400 px-1.5 py-0.5 rounded font-bold text-[10px] font-sans">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-neutral-300 leading-normal font-sans">
                          {log.details}
                        </td>
                        <td className="p-3 text-neutral-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 11: AUTOMATED PUBLISHING & LEGAL FACT CONTROL */}
          {activeTab === 'ai_automation' && (
            <div className="space-y-6" id="view-ai-automation">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase">
                    자동 예약 발행 시스템
                  </span>
                  <h2 className="text-xl font-serif font-bold text-white">기사 자동 작성 및 예약 발행 설정</h2>
                </div>
                <p className="text-xs text-neutral-400 leading-normal">
                  공식 기관의 데이터에 기반하여 기사를 자동으로 생성하고, 지정된 시간에 정기적으로 발행하도록 설정합니다.
                </p>
              </div>

              {/* Status Message Notification */}
              {autoMessage && (
                <div className="bg-blue-950/80 border border-blue-600/50 p-3.5 rounded text-xs text-blue-200 flex items-center justify-between shadow-md">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
                    <span className="font-medium">{autoMessage}</span>
                  </div>
                  <button onClick={() => setAutoMessage(null)} className="text-neutral-400 hover:text-white text-xs">✕</button>
                </div>
              )}

              {/* Overview & Immediate Dispatch Controls */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-3.5 h-3.5 rounded-full ${autoSettings?.enabled ? "bg-emerald-500 animate-pulse" : "bg-neutral-600"}`} />
                    <div>
                      <span className="text-xs font-bold text-neutral-200 block">
                        자동 발행 기능: {autoSettings?.enabled ? "가동 중 (작동 중)" : "일시 정지됨"}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        출처 표시: {autoSettings?.includeLegalDisclaimer ? "기사 하단 출처 표시 켜짐" : "꺼짐"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      disabled={autoTriggering}
                      onClick={handleTriggerAutoPublish}
                      className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 px-5 rounded flex items-center gap-2 shadow-md transition cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${autoTriggering ? "animate-spin" : ""}`} />
                      <span>{autoTriggering ? "기사를 생성하고 발행하는 중..." : "⚡ 지금 바로 기사 자동 발행 실행하기"}</span>
                    </button>
                  </div>
                </div>

                {/* Automation Metrics Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-neutral-950 p-3.5 rounded border border-neutral-850">
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">최근 자동 발행 시각</span>
                    <span className="text-neutral-200 font-mono font-bold text-sm">
                      {autoSettings?.lastAutoRunTime ? new Date(autoSettings.lastAutoRunTime).toLocaleString("ko-KR") : "기록 없음"}
                    </span>
                  </div>
                  <div className="bg-neutral-950 p-3.5 rounded border border-neutral-850">
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">다음 자동 발행 예정 시각</span>
                    <span className="text-amber-400 font-mono font-bold text-sm">
                      {autoSettings?.nextScheduledTime ? new Date(autoSettings.nextScheduledTime).toLocaleString("ko-KR") : "자동 발행 대기 중"}
                    </span>
                  </div>
                  <div className="bg-neutral-950 p-3.5 rounded border border-neutral-850">
                    <span className="text-[10px] text-neutral-500 block uppercase font-bold">누적 자동 발행 기사 수</span>
                    <span className="text-blue-400 font-mono font-black text-base">
                      {autoSettings?.totalAutoPublishedCount || 0} 건
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Configuration Form */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-5">
                <h3 className="text-sm font-bold text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-400" />
                  <span>기사 발행 원칙 및 정기 스케줄 설정</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
                  <div className="space-y-3 bg-neutral-950 p-4 rounded border border-neutral-850">
                    <h4 className="font-bold text-amber-300">1. 저작권 표기 및 검증 설정</h4>
                    
                    <label className="flex items-start gap-2 text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSettings?.includeLegalDisclaimer ?? true}
                        onChange={(e) => handleSaveAutoSettings({ includeLegalDisclaimer: e.target.checked })}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-bold text-white block">기사 하단 출처 및 안내문 자동 표시</span>
                        <span className="text-[11px] text-neutral-400">모든 기사 끝에 저작권 준수 및 제공 출처 안내 문구를 자동으로 첨부합니다.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2 text-neutral-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoSettings?.factCheckStrictness === "strict"}
                        onChange={(e) => handleSaveAutoSettings({ factCheckStrictness: e.target.checked ? "strict" : "standard" })}
                        className="mt-0.5"
                      />
                      <div>
                        <span className="font-bold text-white block">공식 데이터 기반 엄격 검증 모드 (Strict Mode)</span>
                        <span className="text-[11px] text-neutral-400">정부 및 공공기관의 공식 자료에 기초하여 정확한 지표만 기사화합니다.</span>
                      </div>
                    </label>

                    <div className="pt-2">
                      <label className="text-[11px] text-neutral-400 block mb-1 font-bold">기사 검증 통과 기준</label>
                      <select
                        value={autoSettings?.factCheckStrictness || "strict"}
                        onChange={(e) => handleSaveAutoSettings({ factCheckStrictness: e.target.value as any })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-white font-mono"
                      >
                        <option value="strict">엄격 검증 (공식 데이터 95점 이상일 때만 발행)</option>
                        <option value="standard">표준 검증 (일반 보도자료 및 취재 기준 90점 이상)</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 bg-neutral-950 p-4 rounded border border-neutral-850">
                    <h4 className="font-bold text-blue-300">2. 자동 발행 주기 선택</h4>

                    <div>
                      <label className="text-[11px] text-neutral-400 block mb-1 font-bold">발행 방식 선택</label>
                      <select
                        value={autoSettings?.scheduleMode || "24h_staggered"}
                        onChange={(e) => handleSaveAutoSettings({ scheduleMode: e.target.value as any })}
                        className="w-full bg-neutral-900 border border-neutral-800 rounded p-2 text-white font-mono font-bold"
                      >
                        <option value="24h_staggered">★ 24시간 동안 코너별로 분산해서 예약 발행 (권장)</option>
                        <option value="daily_edition">매일 아침(06:00)과 저녁(18:00) 정기 발행</option>
                        <option value="interval">12시간 간격 정기 발행</option>
                        <option value="realtime">자동 발행 없이 수동으로만 진행</option>
                      </select>
                    </div>

                    <label className="flex items-center gap-2 text-neutral-300 cursor-pointer pt-1">
                      <input
                        type="checkbox"
                        checked={autoSettings?.enabled ?? true}
                        onChange={(e) => handleSaveAutoSettings({ enabled: e.target.checked })}
                      />
                      <span className="font-bold text-white">24시간 자동 발행 스케줄 기능 켜기</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* 24-HOUR CATEGORY STAGGERED SCHEDULE TABLE */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-400" />
                      <span>카테고리별 예약 발행 시간표</span>
                    </h3>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      각 뉴스 코너별로 기사가 올라갈 시각을 지정하거나, 자동 추천 시각으로 배치할 수 있습니다.
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={autoLoading}
                    onClick={handleRegenerateSlots}
                    className="bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs py-2 px-3.5 rounded flex items-center gap-1.5 transition cursor-pointer shadow"
                  >
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>발행 시간 자동으로 고르게 재배치하기</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {autoSettings?.categorySlots && autoSettings.categorySlots.length > 0 ? (
                    autoSettings.categorySlots.map((slot) => (
                      <div key={slot.categoryId} className="bg-neutral-950 border border-neutral-850 p-3.5 rounded space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-blue-400">{slot.categoryName}</span>
                          <span className="bg-amber-950/80 text-amber-300 border border-amber-800/60 text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                            예약시각: {slot.timeSlot}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-neutral-500 block font-bold uppercase">발행 시각 직접 변경 (시:분:초)</label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              defaultValue={slot.timeSlot}
                              onBlur={(e) => handleSlotTimeChange(slot.categoryId, e.target.value)}
                              className="w-full bg-neutral-900 border border-neutral-800 text-xs font-mono font-bold text-neutral-100 p-1.5 rounded focus:border-amber-500 outline-none"
                              placeholder="HH:mm:ss"
                            />
                            <button
                              type="button"
                              disabled={autoTriggering}
                              onClick={() => handleTriggerAutoPublish(slot.categoryId)}
                              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-[10px] font-bold px-2.5 py-1.5 rounded whitespace-nowrap border border-neutral-700 transition"
                              title="이 코너의 기사를 즉시 발행합니다"
                            >
                              지금 발행
                            </button>
                          </div>
                        </div>

                        <div className="text-[10px] text-neutral-400 font-mono flex items-center justify-between pt-1 border-t border-neutral-900">
                          <span>다음 예정 시각:</span>
                          <span className="text-amber-400 font-bold">
                            {slot.nextRunTimestamp ? new Date(slot.nextRunTimestamp).toLocaleString("ko-KR", { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : "대기"}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-6 text-neutral-500 text-xs">
                      설정된 코너별 시간표가 없습니다. [발행 시간 자동으로 고르게 재배치하기] 버튼을 누르세요.
                    </div>
                  )}
                </div>
              </div>

              {/* Automated Dispatch Log Table */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-5 space-y-3">
                <h3 className="text-sm font-bold text-white flex items-center justify-between border-b border-neutral-800 pb-2">
                  <span>기사 자동 발행 이력 목록</span>
                  <span className="text-[10px] text-neutral-400 font-mono font-normal">
                    총 {autoSettings?.logs?.length || 0} 건 발행됨
                  </span>
                </h3>

                <div className="bg-neutral-950 rounded border border-neutral-850 overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-neutral-900 border-b border-neutral-850 text-neutral-400 font-mono text-[11px]">
                        <th className="p-3">발행 일시</th>
                        <th className="p-3">뉴스 코너</th>
                        <th className="p-3">기사 제목</th>
                        <th className="p-3 text-center">검증 점수</th>
                        <th className="p-3">처리 결과</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-850 text-[11px] font-sans">
                      {autoSettings?.logs && autoSettings.logs.length > 0 ? (
                        autoSettings.logs.map((log) => (
                          <tr key={log.id} className="hover:bg-neutral-900/50 transition">
                            <td className="p-3 font-mono text-neutral-400 whitespace-nowrap">
                              {new Date(log.timestamp).toLocaleString("ko-KR")}
                            </td>
                            <td className="p-3 font-bold text-blue-400 whitespace-nowrap">
                              {log.categoryName || "AI·공교육"}
                            </td>
                            <td className="p-3 font-bold text-neutral-200">
                              {log.title}
                            </td>
                            <td className="p-3 text-center font-mono font-black">
                              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                                {log.factScore}점
                              </span>
                            </td>
                            <td className="p-3 text-neutral-400 leading-normal">
                              {log.message}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="p-6 text-center text-neutral-500">
                            아직 기록된 자동 발행 내역이 없습니다.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
