import { Elysia, t } from "elysia";

// Data dummy sementara dalam memori
let mahasiswa = [
    {
        id: 1,
        nama: "Ahmad",
        email: "ahmad@example.com",
        jurusan: "Teknik Informatika"
    },
    {
        id: 2,
        nama: "Anisa",
        email: "anisa@example.com",
        jurusan: "Manajemen Informatika"
    },
    {
        id: 3,
        nama: "Andika",
        email: "andika@example.com",
        jurusan: "Teknik Informatika"
    }
];

export const mahasiswaRoute = new Elysia({
    prefix: "/mahasiswa"
})
    // 1. GET ALL MAHASISWA
    .get("/", () => {
        return {
            status: "success",
            data: mahasiswa
        };
    })

    // 2. GET MAHASISWA BY ID
    .get("/:id", ({ params, error }) => {
        const id = parseInt(params.id);
        const data = mahasiswa.find(m => m.id === id);

        if (!data) {
            return error(404, { message: "Mahasiswa tidak ditemukan" });
        }

        return {
            status: "success",
            data: data
        };
    })

    // 3. POST - TAMBAH MAHASISWA BARU
    .post("/", ({ body, error }) => {
        const { nama, email, jurusan } = body as any;

        if (!nama || !email || !jurusan) {
            return error(400, { message: "Field nama, email, dan jurusan wajib diisi" });
        }

        const newMahasiswa = {
            id: mahasiswa.length > 0 ? mahasiswa[mahasiswa.length - 1].id + 1 : 1,
            nama,
            email,
            jurusan
        };

        mahasiswa.push(newMahasiswa);

        return {
            status: "success",
            message: "Mahasiswa berhasil ditambahkan",
            data: newMahasiswa
        };
    })

    // 4. PUT - UPDATE TOTAL/KESELURUHAN DATA MAHASISWA
    .put("/:id", ({ params, body, error }) => {
        const id = parseInt(params.id);
        const index = mahasiswa.findIndex(m => m.id === id);

        if (index === -1) {
            return error(404, { message: "Mahasiswa tidak ditemukan" });
        }

        const { nama, email, jurusan } = body as any;

        // PUT mewajibkan semua data dikirim ulang secara utuh
        if (!nama || !email || !jurusan) {
            return error(400, { message: "Semua field (nama, email, jurusan) harus diisi untuk metode PUT" });
        }

        mahasiswa[index] = {
            id,
            nama,
            email,
            jurusan
        };

        return {
            status: "success",
            message: "Data mahasiswa berhasil diperbarui secara keseluruhan",
            data: mahasiswa[index]
        };
    })

    // 5. PATCH - UPDATE PARSIAL/SEBAGIAN DATA MAHASISWA
    .patch("/:id", ({ params, body, error }) => {
        const id = parseInt(params.id);
        const index = mahasiswa.findIndex(m => m.id === id);

        if (index === -1) {
            return error(404, { message: "Mahasiswa tidak ditemukan" });
        }

        const { nama, email, jurusan } = body as any;

        // PATCH hanya memperbarui field yang dikirimkan saja
        mahasiswa[index] = {
            ...mahasiswa[index],
            ...(nama && { nama }),
            ...(email && { email }),
            ...(jurusan && { jurusan })
        };

        return {
            status: "success",
            message: "Data mahasiswa berhasil diperbarui sebagian",
            data: mahasiswa[index]
        };
    })

    // 6. DELETE - HAPUS DATA MAHASISWA
    .delete("/:id", ({ params, error }) => {
        const id = parseInt(params.id);
        const index = mahasiswa.findIndex(m => m.id === id);

        if (index === -1) {
            return error(404, { message: "Mahasiswa tidak ditemukan" });
        }

        const deletedData = mahasiswa[index];
        mahasiswa = mahasiswa.filter(m => m.id !== id);

        return {
            status: "success",
            message: "Mahasiswa berhasil dihapus",
            data: deletedData
        };
    });