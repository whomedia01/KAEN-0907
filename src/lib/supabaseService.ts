import { createClient, SupabaseClient } from "@supabase/supabase-js";
import seedData from "../../db_data.json";

// Environment variables
const getEnv = (key: string, defaultVal: string = ""): string => {
  if (typeof process !== "undefined" && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  const metaEnv = (import.meta as any)?.env;
  if (metaEnv && metaEnv[key]) {
    return metaEnv[key] as string;
  }
  return defaultVal;
};

const SUPABASE_URL =
  getEnv("VITE_SUPABASE_URL") ||
  getEnv("SUPABASE_URL") ||
  "https://s61C9hSrbMW6pBNNiZ.supabase.co";

const SUPABASE_ANON_KEY =
  getEnv("VITE_SUPABASE_ANON_KEY") ||
  getEnv("SUPABASE_ANON_KEY") ||
  getEnv("SUPABASE_SERVICE_ROLE_KEY") ||
  "sb_publishable_s61C9hSrbMW6pBNNiZ_dqg_z-0M1FTO";

let supabaseInstance: SupabaseClient | null = null;

function isValidHttpUrl(stringVal: string): boolean {
  if (!stringVal || typeof stringVal !== "string") return false;
  try {
    const url = new URL(stringVal);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch (_) {
    return false;
  }
}

export function getSupabase(): SupabaseClient | null {
  if (supabaseInstance) return supabaseInstance;

  try {
    const url = (SUPABASE_URL || "").trim();
    const key = (SUPABASE_ANON_KEY || "").trim();

    if (isValidHttpUrl(url) && key && key.length > 5) {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: true }
      });
      return supabaseInstance;
    }
  } catch (e) {
    console.warn("Supabase client connection note:", e);
  }
  return null;
}

// Interfaces
export interface Article {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  categoryId: string;
  authorId: string;
  imageUrl?: string;
  imageCaption?: string;
  imageCopyright?: string;
  status: "published" | "draft" | "scheduled";
  scheduledAt?: string | null;
  createdAt: string;
  viewCount: number;
  tags: string[];
  isHero?: boolean;
  isOpinion?: boolean;
  isPhoto?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
}

export interface Revision {
  id: string;
  articleId: string;
  title: string;
  content: string;
  modifiedBy: string;
  changeReason: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  details: string;
  timestamp: string;
}

// Data conversion helpers for Supabase (camelCase <-> snake_case / raw)
function toDbArticle(art: any) {
  return {
    id: art.id,
    slug: art.slug || art.id,
    title: art.title,
    content: art.content,
    excerpt: art.excerpt || "",
    category_id: art.categoryId || art.category_id || "cat_policy",
    author_id: art.authorId || art.author_id || "auth_policy",
    image_url: art.imageUrl || art.image_url || "",
    image_caption: art.imageCaption || art.image_caption || "",
    image_copyright: art.imageCopyright || art.image_copyright || "한국AI교육신문 DB",
    status: art.status || "published",
    scheduled_at: art.scheduledAt || art.scheduled_at || null,
    created_at: art.createdAt || art.created_at || new Date().toISOString(),
    view_count: art.viewCount ?? art.view_count ?? 0,
    tags: Array.isArray(art.tags) ? art.tags : [],
    is_hero: !!(art.isHero ?? art.is_hero),
    is_opinion: !!(art.isOpinion ?? art.is_opinion),
    is_photo: !!(art.isPhoto ?? art.is_photo)
  };
}

function fromDbArticle(row: any): Article {
  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    content: row.content,
    excerpt: row.excerpt || "",
    categoryId: row.category_id || row.categoryId || "cat_policy",
    authorId: row.author_id || row.authorId || "auth_policy",
    imageUrl: row.image_url || row.imageUrl || "",
    imageCaption: row.image_caption || row.imageCaption || "",
    imageCopyright: row.image_copyright || row.imageCopyright || "한국AI교육신문 DB",
    status: row.status || "published",
    scheduledAt: row.scheduled_at || row.scheduledAt || null,
    createdAt: row.created_at || row.createdAt || new Date().toISOString(),
    viewCount: Number(row.view_count ?? row.viewCount ?? 0),
    tags: Array.isArray(row.tags)
      ? row.tags
      : typeof row.tags === "string"
      ? JSON.parse(row.tags)
      : [],
    isHero: !!(row.is_hero ?? row.isHero),
    isOpinion: !!(row.is_opinion ?? row.isOpinion),
    isPhoto: !!(row.is_photo ?? row.isPhoto)
  };
}

function toDbCategory(cat: any) {
  return {
    id: cat.id,
    name: cat.name,
    slug: cat.slug || cat.id,
    description: cat.description || "",
    display_order: cat.displayOrder ?? cat.display_order ?? 1
  };
}

function fromDbCategory(row: any): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.id,
    description: row.description || "",
    displayOrder: row.display_order ?? row.displayOrder ?? 1
  };
}

function toDbRevision(rev: any) {
  return {
    id: rev.id || "rev_" + Date.now(),
    article_id: rev.articleId || rev.article_id,
    title: rev.title,
    content: rev.content,
    modified_by: rev.modifiedBy || rev.modified_by || "관리자",
    change_reason: rev.changeReason || rev.change_reason || "내용 수정",
    created_at: rev.createdAt || rev.created_at || new Date().toISOString()
  };
}

function fromDbRevision(row: any): Revision {
  return {
    id: row.id,
    articleId: row.article_id || row.articleId,
    title: row.title,
    content: row.content,
    modifiedBy: row.modified_by || row.modifiedBy || "관리자",
    changeReason: row.change_reason || row.changeReason || "내용 수정",
    createdAt: row.created_at || row.createdAt || new Date().toISOString()
  };
}

function toDbAuditLog(log: any) {
  const ts = log.timestamp || log.created_at || new Date().toISOString();
  return {
    id: log.id || "log_" + Date.now(),
    user_id: log.userId || log.user_id || "auth_admin",
    user_name: log.userName || log.user_name || "관리자",
    user_role: log.userRole || log.user_role || "Admin",
    action: log.action,
    details: log.details,
    timestamp: ts,
    created_at: ts
  };
}

function fromDbAuditLog(row: any): AuditLog {
  return {
    id: row.id,
    userId: row.user_id || row.userId || "auth_admin",
    userName: row.user_name || row.userName || "관리자",
    userRole: row.user_role || row.userRole || "Admin",
    action: row.action,
    details: row.details,
    timestamp: row.timestamp || row.created_at || new Date().toISOString()
  };
}

// --- Supabase Database Operations ---

// 1. ARTICLES
export async function getArticlesFromSupabase(): Promise<Article[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.warn("Supabase articles query note:", error.message);
      return null;
    }

    if (data && data.length > 0) {
      return data.map(fromDbArticle);
    }
  } catch (err) {
    console.error("Error fetching articles from Supabase:", err);
  }
  return null;
}

export async function saveArticleToSupabase(
  articleData: any,
  modifiedBy: string = "관리자",
  changeReason: string = "기사 내용 작성 및 수정"
): Promise<{ article: Article; revision: Revision; auditLog: AuditLog } | null> {
  const supabase = getSupabase();
  const nowIso = new Date().toISOString();
  const isNew = !articleData.id;
  const id = articleData.id || "art_" + Date.now();

  const fullArticle: Article = {
    id,
    slug: articleData.slug || "art-" + Date.now(),
    title: articleData.title,
    content: articleData.content,
    excerpt: articleData.excerpt || "",
    categoryId: articleData.categoryId || "cat_policy",
    authorId: articleData.authorId || "auth_policy",
    imageUrl: articleData.imageUrl || "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800",
    imageCaption: articleData.imageCaption || "",
    imageCopyright: articleData.imageCopyright || "한국AI교육신문 DB",
    status: articleData.status || "published",
    scheduledAt: articleData.scheduledAt || null,
    createdAt: articleData.createdAt || nowIso,
    viewCount: articleData.viewCount || 0,
    tags: articleData.tags || ["AI교육"],
    isHero: !!articleData.isHero,
    isOpinion: !!articleData.isOpinion,
    isPhoto: !!articleData.isPhoto
  };

  const dbRow = toDbArticle(fullArticle);

  // 1. Revision Record
  const rev: Revision = {
    id: "rev_" + Date.now(),
    articleId: id,
    title: fullArticle.title,
    content: fullArticle.content,
    modifiedBy: modifiedBy,
    changeReason: isNew ? "최초 기사 작성 등록" : changeReason,
    createdAt: nowIso
  };

  // 2. Audit Log Record
  const audit: AuditLog = {
    id: "log_" + Date.now(),
    userId: "auth_admin",
    userName: modifiedBy,
    userRole: "Admin",
    action: isNew ? "CREATE_ARTICLE" : "UPDATE_ARTICLE",
    details: `[Supabase 영구저장] 기사 ${isNew ? "신규작성" : "수정"}: "${fullArticle.title}" (수정이유: ${rev.changeReason})`,
    timestamp: nowIso
  };

  if (supabase) {
    try {
      // Upsert Article
      const { error: artErr } = await supabase.from("articles").upsert(dbRow);
      if (artErr) console.warn("Supabase upsert article warning:", artErr.message);

      // Insert Revision
      const { error: revErr } = await supabase.from("revisions").insert(toDbRevision(rev));
      if (revErr) console.warn("Supabase insert revision warning:", revErr.message);

      // Insert Audit Log
      const { error: logErr } = await supabase.from("audit_logs").insert(toDbAuditLog(audit));
      if (logErr) console.warn("Supabase insert audit log warning:", logErr.message);
    } catch (e) {
      console.error("Failed to sync article to Supabase:", e);
    }
  }

  return { article: fullArticle, revision: rev, auditLog: audit };
}

export async function deleteArticleFromSupabase(
  id: string,
  userName: string = "관리자"
): Promise<boolean> {
  const supabase = getSupabase();
  const nowIso = new Date().toISOString();

  const audit: AuditLog = {
    id: "log_" + Date.now(),
    userId: "auth_admin",
    userName,
    userRole: "Admin",
    action: "DELETE_ARTICLE",
    details: `[Supabase 영구기록] 기사 영구 삭제 (ID: ${id})`,
    timestamp: nowIso
  };

  if (supabase) {
    try {
      await supabase.from("articles").delete().eq("id", id);
      await supabase.from("audit_logs").insert(toDbAuditLog(audit));
    } catch (e) {
      console.error("Failed to delete article from Supabase:", e);
    }
  }
  return true;
}

// 2. CATEGORIES
export async function getCategoriesFromSupabase(): Promise<Category[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(fromDbCategory);
    }
  } catch (e) {
    console.error("Failed to fetch categories from Supabase:", e);
  }
  return null;
}

export async function saveCategoryToSupabase(cat: Category): Promise<Category> {
  const supabase = getSupabase();
  const nowIso = new Date().toISOString();

  const audit: AuditLog = {
    id: "log_" + Date.now(),
    userId: "auth_admin",
    userName: "관리자",
    userRole: "Admin",
    action: "SAVE_CATEGORY",
    details: `[Supabase 영구기록] 카테고리 저장: "${cat.name}" (${cat.id})`,
    timestamp: nowIso
  };

  if (supabase) {
    try {
      await supabase.from("categories").upsert(toDbCategory(cat));
      await supabase.from("audit_logs").insert(toDbAuditLog(audit));
    } catch (e) {
      console.error("Failed to save category to Supabase:", e);
    }
  }
  return cat;
}

// 3. REVISIONS
export async function getRevisionsFromSupabase(articleId?: string): Promise<Revision[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    let query = supabase.from("revisions").select("*").order("created_at", { ascending: false });
    if (articleId) {
      query = query.eq("article_id", articleId);
    }
    const { data, error } = await query;
    if (!error && data) {
      return data.map(fromDbRevision);
    }
  } catch (e) {
    console.error("Failed to fetch revisions from Supabase:", e);
  }
  return null;
}

export async function rollbackRevisionInSupabase(
  revisionId: string,
  modifiedBy: string = "관리자"
): Promise<{ success: boolean; revision?: Revision; articleId?: string }> {
  const supabase = getSupabase();
  const nowIso = new Date().toISOString();

  let targetRev: Revision | null = null;

  if (supabase) {
    try {
      const { data } = await supabase.from("revisions").select("*").eq("id", revisionId).single();
      if (data) {
        targetRev = fromDbRevision(data);
      }
    } catch (e) {
      console.error("Failed to fetch revision for rollback:", e);
    }
  }

  if (targetRev) {
    // 1. Update article content
    if (supabase) {
      await supabase
        .from("articles")
        .update({
          title: targetRev.title,
          content: targetRev.content
        })
        .eq("id", targetRev.articleId);

      // 2. Add new Revision record for rollback
      const newRev: Revision = {
        id: "rev_" + Date.now(),
        articleId: targetRev.articleId,
        title: targetRev.title,
        content: targetRev.content,
        modifiedBy,
        changeReason: `[복원] 리비전 (${revisionId}) 시점으로 기사 내용 복구`,
        createdAt: nowIso
      };
      await supabase.from("revisions").insert(toDbRevision(newRev));

      // 3. Audit Log
      const audit: AuditLog = {
        id: "log_" + Date.now(),
        userId: "auth_admin",
        userName: modifiedBy,
        userRole: "Admin",
        action: "ROLLBACK_REVISION",
        details: `[Supabase 영구기록] 기사 (${targetRev.articleId}) 리비전(${revisionId}) 복원 수행`,
        timestamp: nowIso
      };
      await supabase.from("audit_logs").insert(toDbAuditLog(audit));
    }

    return { success: true, revision: targetRev, articleId: targetRev.articleId };
  }

  return { success: false };
}

// 4. AUDIT LOGS
export async function getAuditLogsFromSupabase(): Promise<AuditLog[] | null> {
  const supabase = getSupabase();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      return data.map(fromDbAuditLog);
    }
  } catch (e) {
    console.error("Failed to fetch audit logs from Supabase:", e);
  }
  return null;
}

export async function addAuditLogToSupabase(log: Partial<AuditLog>): Promise<AuditLog> {
  const supabase = getSupabase();
  const nowIso = new Date().toISOString();

  const audit: AuditLog = {
    id: log.id || "log_" + Date.now(),
    userId: log.userId || "auth_admin",
    userName: log.userName || "관리자",
    userRole: log.userRole || "Admin",
    action: log.action || "ADMIN_ACTION",
    details: log.details || "관리자 액션 실행",
    timestamp: log.timestamp || nowIso
  };

  if (supabase) {
    try {
      await supabase.from("audit_logs").insert(toDbAuditLog(audit));
    } catch (e) {
      console.error("Failed to write audit log to Supabase:", e);
    }
  }

  return audit;
}

// Initial Seeding to Supabase if tables are empty
export async function seedSupabaseIfEmpty(): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    // Check if articles exist
    const { count, error } = await supabase
      .from("articles")
      .select("*", { count: "exact", head: true });

    if (error || count === 0) {
      console.log("Seeding initial data into Supabase...");

      // 1. Categories
      if (Array.isArray(seedData.categories)) {
        const catRows = seedData.categories.map(toDbCategory);
        await supabase.from("categories").upsert(catRows);
      }

      // 2. Articles
      if (Array.isArray(seedData.articles)) {
        const artRows = seedData.articles.map(toDbArticle);
        await supabase.from("articles").upsert(artRows);
      }

      // 3. Revisions
      if (Array.isArray(seedData.revisions)) {
        const revRows = seedData.revisions.map(toDbRevision);
        await supabase.from("revisions").upsert(revRows);
      }

      // 4. Audit Logs
      if (Array.isArray(seedData.auditLogs)) {
        const logRows = seedData.auditLogs.map(toDbAuditLog);
        await supabase.from("audit_logs").upsert(logRows);
      }

      console.log("Supabase seeding completed!");
      return true;
    }
  } catch (e) {
    console.warn("Supabase auto-seed attempt:", e);
  }
  return false;
}
