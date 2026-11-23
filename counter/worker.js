export default {
  async fetch(request, env) {
    if(request.headers.get('Origin') !== env.SITE_ORIGIN) return new Response(null,{status:403});
    if(request.method !== 'POST') return new Response(null,{status:405});
    const book=env.BOOK.get(env.BOOK.idFromName('kuroneko'));
    const result=await book.fetch(request);
    return new Response(result.body,{status:result.status,headers:{
      'Access-Control-Allow-Origin':env.SITE_ORIGIN,'Content-Type':'application/json','Cache-Control':'no-store'
    }});
  }
};
export class BookCounter {
  constructor(ctx) {
    this.sql=ctx.storage.sql;
    this.sql.exec('CREATE TABLE IF NOT EXISTS entries(kind TEXT, token TEXT, PRIMARY KEY(kind, token))');
  }
  async fetch(request) {
    let input;
    try { input=await request.json(); } catch { return new Response(null,{status:400}); }
    const {visitor,visit,action,enabled}=input??{};
    const uuid=/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
    if(!uuid.test(visitor)||!uuid.test(visit)||!['open','likes','marks'].includes(action)||
      (action!=='open' && typeof enabled!=='boolean')) return new Response(null,{status:400});
    this.sql.exec('INSERT OR IGNORE INTO entries VALUES(?,?)','visits',visit);
    if(action!=='open') {
      if(enabled) this.sql.exec('INSERT OR IGNORE INTO entries VALUES(?,?)',action,visitor);
      else this.sql.exec('DELETE FROM entries WHERE kind=? AND token=?',action,visitor);
    }
    const data={visits:0,likes:0,marks:0,selected:{likes:false,marks:false}};
    for(const row of this.sql.exec('SELECT kind,COUNT(*) AS n FROM entries GROUP BY kind')) data[row.kind]=row.n;
    for(const row of this.sql.exec("SELECT kind FROM entries WHERE token=? AND kind IN ('likes','marks')",visitor)) data.selected[row.kind]=true;
    return Response.json(data);
  }
}
