"use server";

import { createHash } from "crypto";
import { extname } from "path";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { makeSlug } from "@/lib/admin/utils";

const BUCKET = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET || "products";

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  if (slug) revalidatePath(`/product/${slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/products");
}

function parseProductForm(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const slugRaw = String(formData.get("slug") || "").trim();
  const price = Number(formData.get("price") || 0);
  const compareRaw = String(formData.get("compare_at_price") || "").trim();
  const puffsRaw = String(formData.get("puffs") || "").trim();
  const tagsRaw = String(formData.get("tags") || "").trim();

  return {
    name,
    slug: makeSlug(slugRaw || name),
    brand: String(formData.get("brand") || "").trim(),
    category_name: String(formData.get("category_name") || "").trim(),
    description: String(formData.get("description") || "").trim(),
    price,
    compare_at_price: compareRaw ? Number(compareRaw) : null,
    puffs: puffsRaw ? Number(puffsRaw) : null,
    on_sale: formData.get("on_sale") === "on",
    featured: formData.get("featured") === "on",
    best_seller: formData.get("best_seller") === "on",
    in_stock: formData.get("in_stock") === "on",
    stock_quantity: Number(formData.get("stock_quantity") || 0),
    tags: tagsRaw
      ? tagsRaw
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
  };
}

async function uploadImage(file: File, slug: string) {
  if (!file || file.size === 0) return null;

  const admin = createAdminClient();
  const bytes = Buffer.from(await file.arrayBuffer());
  const ext = extname(file.name).toLowerCase() || ".jpg";
  const hash = createHash("sha1").update(bytes).digest("hex").slice(0, 10);
  const path = `${slug}/${Date.now()}-${hash}${ext}`;

  const { error } = await admin.storage.from(BUCKET).upload(path, bytes, {
    contentType: file.type || "image/jpeg",
    upsert: true,
  });
  if (error) throw error;

  const { data } = admin.storage.from(BUCKET).getPublicUrl(path);
  return { path, url: data.publicUrl };
}

export async function createProductAction(formData: FormData) {
  await requireAdmin();

  const input = parseProductForm(formData);
  if (!input.name || !input.slug) {
    return { ok: false as const, error: "Name is required" };
  }

  const admin = createAdminClient();
  const imageFile = formData.get("image") as File | null;
  let image_path: string | null = null;
  let image_url: string | null = null;
  const image_urls: string[] = [];

  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadImage(imageFile, input.slug);
    if (uploaded) {
      image_path = uploaded.path;
      image_url = uploaded.url;
      image_urls.push(uploaded.url);
    }
  }

  const { data, error } = await admin
    .from("products")
    .insert({
      name: input.name,
      slug: input.slug,
      brand: input.brand || null,
      category_name: input.category_name || null,
      description: input.description || null,
      price: input.price,
      compare_at_price: input.compare_at_price,
      puffs: input.puffs,
      on_sale: input.on_sale,
      featured: input.featured,
      best_seller: input.best_seller,
      in_stock: input.in_stock,
      stock_quantity: input.stock_quantity,
      image_path,
      image_url,
      metadata: {
        tags: input.tags,
        image_urls,
        source_images: [],
      },
    })
    .select("id, slug")
    .single();

  if (error) return { ok: false as const, error: error.message };

  revalidateStorefront(data.slug);
  redirect(`/admin/products/${data.id}`);
}

export async function updateProductAction(id: string, formData: FormData) {
  await requireAdmin();

  const input = parseProductForm(formData);
  if (!input.name || !input.slug) {
    return { ok: false as const, error: "Name is required" };
  }

  const admin = createAdminClient();
  const { data: existing, error: existingErr } = await admin
    .from("products")
    .select("image_path, image_url, metadata")
    .eq("id", id)
    .single();
  if (existingErr) return { ok: false as const, error: existingErr.message };

  const metadata = (existing.metadata || {}) as Record<string, unknown>;
  const image_urls = Array.isArray(metadata.image_urls)
    ? [...(metadata.image_urls as string[])]
    : existing.image_url
      ? [existing.image_url]
      : [];

  let image_path = existing.image_path as string | null;
  let image_url = existing.image_url as string | null;

  const imageFile = formData.get("image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const uploaded = await uploadImage(imageFile, input.slug);
    if (uploaded) {
      image_path = uploaded.path;
      image_url = uploaded.url;
      image_urls.unshift(uploaded.url);
    }
  }

  const { error } = await admin
    .from("products")
    .update({
      name: input.name,
      slug: input.slug,
      brand: input.brand || null,
      category_name: input.category_name || null,
      description: input.description || null,
      price: input.price,
      compare_at_price: input.compare_at_price,
      puffs: input.puffs,
      on_sale: input.on_sale,
      featured: input.featured,
      best_seller: input.best_seller,
      in_stock: input.in_stock,
      stock_quantity: input.stock_quantity,
      image_path,
      image_url,
      metadata: {
        ...metadata,
        tags: input.tags,
        image_urls,
      },
    })
    .eq("id", id);

  if (error) return { ok: false as const, error: error.message };

  revalidateStorefront(input.slug);
  return { ok: true as const };
}

export async function deleteProductAction(id: string) {
  await requireAdmin();
  const admin = createAdminClient();

  const { data: existing } = await admin
    .from("products")
    .select("slug")
    .eq("id", id)
    .maybeSingle();

  const { error } = await admin.from("products").delete().eq("id", id);
  if (error) return { ok: false as const, error: error.message };

  revalidateStorefront(existing?.slug);
  redirect("/admin/products");
}
