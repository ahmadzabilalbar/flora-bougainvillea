import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-[70dvh] place-items-center px-4 text-center">
      <div>
        <p className="font-display text-7xl text-bract-600">404</p>
        <h1 className="mt-4 font-display text-3xl text-leaf-900">Bunga ini telah hilang entah ke mana</h1>
        <p className="mt-2 text-stone-600">Halaman yang anda cari tidak wujud.</p>
        <Link href="/" className="btn-primary mt-8">
          Kembali ke laman utama
        </Link>
      </div>
    </div>
  );
}
