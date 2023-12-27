const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('blog.db');


db.serialize(() =>{
    db.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            image_src TEXT NOT NULL,
            content TEXT,
            creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            last_edited DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `
    );
});


function initalizeStartPosts() {
     const startPosts = [
        {
            author: 'John',
            title: 'Min sommar dag',
            image_src: 'https://placehold.jp/256x256.png',
            content: "I en värld fylld av hektik och stress kan vi ibland glömma bort de små glädjeämnena i vardagen. En sådan enkel njutning är den första koppen kaffe på morgonen. Doften av nymalet kaffe fyller luften och värmer själen. Det är en stund av lugn och stillhet innan dagen kickar igång. Att sätta sig ner med en kopp varmt kaffe ger en chans att reflektera, planera dagen och bara vara i nuet. Det är en ritual som ger energi och en positiv start på dagen. Så nästa gång du känner dig överväldigad, ta en paus, brygg en kopp kaffe och låt dig själv uppskatta livets enkla glädjeämnen.",
        },
        {
            author: 'Alice',
            title: 'Kryssning i karribien',
            image_src: 'https://placehold.jp/256x256.png',
            content: "I en värld fylld av hektik och stress kan vi ibland glömma bort de små glädjeämnena i vardagen. En sådan enkel njutning är den första koppen kaffe på morgonen. Doften av nymalet kaffe fyller luften och värmer själen. Det är en stund av lugn och stillhet innan dagen kickar igång. Att sätta sig ner med en kopp varmt kaffe ger en chans att reflektera, planera dagen och bara vara i nuet. Det är en ritual som ger energi och en positiv start på dagen. Så nästa gång du känner dig överväldigad, ta en paus, brygg en kopp kaffe och låt dig själv uppskatta livets enkla glädjeämnen.",
        },
        {
            author: 'Henrik',
            title: 'Min resa till Gotland',
            image_src: 'https://placehold.jp/256x256.png',
            content: "I en värld fylld av hektik och stress kan vi ibland glömma bort de små glädjeämnena i vardagen. En sådan enkel njutning är den första koppen kaffe på morgonen. Doften av nymalet kaffe fyller luften och värmer själen. Det är en stund av lugn och stillhet innan dagen kickar igång. Att sätta sig ner med en kopp varmt kaffe ger en chans att reflektera, planera dagen och bara vara i nuet. Det är en ritual som ger energi och en positiv start på dagen. Så nästa gång du känner dig överväldigad, ta en paus, brygg en kopp kaffe och låt dig själv uppskatta livets enkla glädjeämnen.",
        },
        {
            author: 'Sarah',
            title: 'En kväll i mars',
            image_src: 'https://placehold.jp/256x256.png',
            content: "I en värld fylld av hektik och stress kan vi ibland glömma bort de små glädjeämnena i vardagen. En sådan enkel njutning är den första koppen kaffe på morgonen. Doften av nymalet kaffe fyller luften och värmer själen. Det är en stund av lugn och stillhet innan dagen kickar igång. Att sätta sig ner med en kopp varmt kaffe ger en chans att reflektera, planera dagen och bara vara i nuet. Det är en ritual som ger energi och en positiv start på dagen. Så nästa gång du känner dig överväldigad, ta en paus, brygg en kopp kaffe och låt dig själv uppskatta livets enkla glädjeämnen.",
        }
    ];

    
    startPosts.forEach((post) =>{
        console.log(post.author, post.image_src, post.content);
        const sql = `INSERT INTO posts (author, title, image_src, content, creation_date) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)`;
         db.run(sql, [post.author, post.title, post.image_src, post.content], (err) =>{
            if (err){
                console.error(err);
                return console.log('Server Error');
            }
        });
    });
    
}


module.exports = initalizeStartPosts;
