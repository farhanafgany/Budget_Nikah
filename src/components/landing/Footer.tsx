export function Footer() {
  return (
    <footer className="px-6 py-10 bg-nikah-text text-white/70">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm">

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#F5E8EC] to-[#C07888] flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-extrabold">B</span>
          </div>
          <span className="font-extrabold text-white tracking-tight">BudgetNikah</span>
        </div>

        <p className="text-xs text-center">
          Wedding financial planner untuk pasangan Indonesia.
        </p>

        <div className="flex items-center gap-5 text-xs">
          <a href="#fitur" className="hover:text-white transition-colors">Fitur</a>
          <a href="#harga" className="hover:text-white transition-colors">Harga</a>
          <a href="#cara-kerja" className="hover:text-white transition-colors">Cara Kerja</a>
        </div>

      </div>

      <div className="max-w-4xl mx-auto mt-6 pt-6 border-t border-white/10 text-center text-xs">
        © {new Date().getFullYear()} BudgetNikah. Dibuat dengan ❤️ untuk pasangan Indonesia.
      </div>
    </footer>
  )
}
