import { Hono } from 'hono'
import { db } from '$db'
import * as table from '$schema';
import { eq, sql } from 'drizzle-orm';
import { format } from 'date-fns';

const app = new Hono();

app.post('/create', async (c) => {
    const { user_id, title, content, post_type_id, post_tag_id, is_visible, like_count } = await c.req.json();

    // return c.json("HELLO",200)
    try {
        const response = await db.insert(table.posts).values({
            user_id: user_id,
            title: title,
            content: content,
            post_type_id: post_type_id,
            post_tag_id: post_tag_id,
            is_visible: is_visible,
            like_count: like_count
        })
        console.log(response)
        if(response){
            return c.json({message: "Post Created!"},201)
        }
    } catch (error) {
        return c.json({message: "Post Created Failed!"},400)
    }
})

//getPost

app.get('/get-post', async(c)=>{

    const response = await db.select({
        id: table.posts.id,
        user_id: table.posts.user_id,
        username: table.users.username,
        fullname: table.users.fullname,
        title: table.posts.title,
        content: table.posts.content,
        post_type_name: table.postType.name, 
        post_tag_name: table.postTag.name,    // ดึงชื่อแท็กจาก PostTag
        like_count: table.posts.like_count,
        is_visible: table.posts.is_visible,
        created_at: sql`TO_CHAR(${table.posts.created_at} + INTERVAL '7 hours', 'DD Mon YYYY HH24:MI')`.as('created_at')
      })
      .from(table.posts)
      .innerJoin(table.postType, eq(table.posts.post_type_id, table.postType.id))  // join กับ PostType
      .innerJoin(table.postTag, eq(table.posts.post_tag_id, table.postTag.id))    // join กับ PostTag
      .innerJoin(table.users, eq(table.posts.user_id, table.users.id));  
    return c.json(response,200)
})


export default app;