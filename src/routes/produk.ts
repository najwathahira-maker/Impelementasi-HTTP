import { Elysia, t } from "elysia";
import { db } from "../db/index";
import { barangTable } from "../db/schema";
import { eq } from "drizzle-orm";

export const produkRoute = new Elysia({
    prefix: "/produk"
})

// 1. READ: Mendapatkan semua barang
produkRoute.get("/", async () => {
    const produk = await db.select().from(barangTable);
    return produk;
});

// 2. READ: Mendapatkan barang berdasarkan ID (Tanpa .get())
produkRoute.get("/:id", async ({ params}) => {
    const id = Number(params.id);
    
    // Gunakan array destructuring [produk] atau ambil index ke-0
    const produk = await db.select()
        .from(barangTable)
        .where(eq(barangTable.id, id));

    if (!produk || produk.length === 0) {
        return { message: "Barang tidak ditemukan" };
    }

    return produk[0]; // Ambil data pertama
});

// 3. CREATE: Menambahkan barang baru
produkRoute.post("/", async ({ body }) => {
    try {
        const newProduk = await db.insert(barangTable)
            .values(body)
            .returning();

        return {
            message: "Barang berhasil ditambahkan",
            data: newProduk[0]
        };
    } catch (err) {
        return { message: "Gagal menambahkan barang", error: err };
    }
}, {
    body: t.Object({
        namabarang: t.String(),
        stock: t.Optional(t.Number()),
        harga: t.Number(),
    })
});

// 4. UPDATE: Mengubah data barang berdasarkan ID
produkRoute.put("/:id", async ({ params, body }) => {
    const id = Number(params.id);

    const existing = await db.select()
        .from(barangTable)
        .where(eq(barangTable.id, id));

    if (!existing || existing.length === 0) {
        return { message: "Barang tidak ditemukan" };
    }

    try {
        const updatedProduk = await db.update(barangTable)
            .set(body)
            .where(eq(barangTable.id, id))
            .returning();

        return {
            message: "Barang berhasil diperbarui",
            data: updatedProduk[0]
        };
    } catch (err) {
        return { message: "Gagal memperbarui barang", error: err };
    }
}, {
    // Tambahkan validasi body di sini agar error garis merahnya hilang
    body: t.Object({
        namabarang: t.Optional(t.String()),
        stock: t.Optional(t.Number()),
        harga: t.Optional(t.Number()),
    })
});

// 5. DELETE: Menghapus barang berdasarkan ID
produkRoute.delete("/:id", async ({ params }) => {
    const id = Number(params.id);

    const existing = await db.select()
        .from(barangTable)
        .where(eq(barangTable.id, id));

    if (!existing || existing.length === 0) {
        return { message: "Barang tidak ditemukan" };
    }

    try {
        await db.delete(barangTable)
            .where(eq(barangTable.id, id));

        return {
            message: "Barang berhasil dihapus"
        };
    } catch (err) {
        return { message: "Gagal menghapus barang", error: err };
    }
});