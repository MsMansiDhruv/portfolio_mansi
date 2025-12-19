import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

export default async function PostPage({ params }){
  const { slug } = params
  const file = path.join(process.cwd(),'content/posts', slug + '.md')
  const raw = fs.readFileSync(file,'utf-8')
  const { data, content } = matter(raw)
  const processed = await remark().use(html).process(content)
  const rendered = processed.toString()

  return (
    <article>
      <h1 className="text-3xl font-bold">{data.title}</h1>
      <div className="prose mt-6 text-slate-200" dangerouslySetInnerHTML={{__html: rendered}} />
    </article>
  )
}
