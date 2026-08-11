export default function SisterPage() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-dvh min-w-0 flex-col items-center justify-center overflow-x-hidden bg-[#faf9f6] px-4 py-6 text-center dark:bg-slate-950">
      <div className="flex w-full max-w-[100vw] flex-col items-center justify-center gap-2 sm:gap-4">
        <p
          className="max-w-full break-words text-[clamp(2.25rem,7vw,5.5rem)] font-black uppercase leading-none tracking-tight text-slate-950 dark:text-white"
          aria-hidden="false"
        >
          SAY HELLO
        </p>
        <p className="max-w-full break-words text-[clamp(3.5rem,min(22vw,18vh),14rem)] font-black uppercase leading-[0.85] tracking-tighter text-teal-600 dark:text-teal-400">
          DIDIIIIIII
        </p>
      </div>
      <p className="mt-8 text-sm text-slate-500 dark:text-slate-400">you&apos;ve been summoned 👀</p>
    </div>
  );
}
