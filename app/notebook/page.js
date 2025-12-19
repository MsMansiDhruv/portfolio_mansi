export default function Notebook(){
  return (
    <section>
      <h2 className="text-3xl font-bold">Mansi Compute Pod (MCP)</h2>
      <p className="mt-4 text-slate-300">This page links to an interactive GPU notebook for CUDA experiments. Options:</p>
      <ul className="mt-4 list-disc list-inside text-slate-400">
        <li>Open a <a className="text-primary" href="https://colab.research.google.com/" target="_blank">Google Colab</a> with prefilled notebook</li>
        <li>Launch a RunPod session and paste the pod link here</li>
        <li>Or embed your self-hosted JupyterLab via iframe (set TRUSTED_IFRAME_URL env)</li>
      </ul>

      <div className="mt-6">
        <a href="https://colab.research.google.com/" className="px-4 py-2 bg-primary rounded text-black font-semibold">Open CUDA Colab</a>
      </div>

      <div className="mt-6 text-slate-400 text-sm">Tip: For a production demo, deploy a small RunPod instance and add the iframe URL into an environment variable named <code>NOTEBOOK_IFRAME</code>.</div>
    </section>
  )
}
