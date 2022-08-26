const playBtn = document.querySelector(".playBtn")
const music = document.querySelector("#music")
const ge = document.getElementById("geci")
const id = window.localStorage.getItem("cloudId")
const recommendPage = document.querySelector(".recommend")
const commentPage = document.querySelector(".comment")

// 根据id获取对应歌曲信息
async function getMusic() {
    // 换audio
    const music = await fetch("http://121.40.19.111:3000/song/url?id=" + id)
    const res = await music.json();
    document.getElementById("music").src = res.data[0].url

    // 换封面
    const musicDetail = await fetch("http://121.40.19.111:3000/song/detail?ids=" + id)
    const res1 = await musicDetail.json()
    document.getElementById("musicName").innerHTML = res1.songs[0].name;
    document.getElementById("cdCover").src = res1.songs[0].al.picUrl
    document.getElementById("bg").src = res1.songs[0].al.picUrl
    document.getElementById("bgInheader").src = res1.songs[0].al.picUrl
}

// 获取歌词
async function lyric(id) {
    const lyric = await fetch("http://121.40.19.111:3000/lyric?id=" + id)
    const res = await lyric.json()
    if (res.uncollected) {
        return "暂无歌词"
    }
    const str = res.lrc.lyric
    return str
}
const lrc = await lyric(id);

// 播放按钮
playBtn.addEventListener("click", async() => {
    if (music.paused) {
        document.querySelector("#cdCover").style.animationPlayState = "running"
        document.querySelector("#btnImg").src = "../images/播放.png";
        document.querySelector("#music").play()
    } else {
        document.querySelector("#cdCover").style.animationPlayState = "paused"
        document.querySelector("#btnImg").src = "../images/暂停.png";
        document.querySelector("#music").pause()
    }
})

function gecitongbu(lrc) {
    let lrcArr = lrc.split("[")
    let html = ""
    for (let i = 0; i < lrcArr.length; i++) {
        let arr = lrcArr[i].split("]")
        let time = arr[0].split(".")
        let timer = time[0].split(":")
        let ms = timer[0] * 60 + timer[1] * 1
        let text = arr[1]
        if (text) {
            html += "<p id=" + ms + ">" + text + "</p>"
        }
        document.getElementById("geci").innerHTML = html /*获取歌词*/
    }
}

function Tongbu() {
    gecitongbu(lrc)
    let oP = ge.getElementsByTagName("p")
    let curTime
    music.addEventListener("timeupdate", function() {
        curTime = parseInt(this.currentTime)
        if (document.getElementById(curTime)) {
            for (let i = 0; i < oP.length; i++) {
                oP[i].style.cssText = "font-size: 18px; color: gray;"
            }
            document.getElementById(curTime).style.cssText = "color: white;font-size: 22px;"
            ge.style.top = (document.getElementById(curTime).offsetTop - 28) * (-1) + "px"
        }
    })
}

//推荐歌曲
async function recommend() {
    const recom = await fetch("http://121.40.19.111:3000/simi/song?id=" + id);
    const res = await recom.json();
    for (let i = 0; i < res.songs.length; i++) {
        const box = document.createElement("div")
        box.className = "recommendBox"

        const cover = document.createElement("img")
        cover.className = "rec_cover"
        cover.src = res.songs[i].album.blurPicUrl

        const musicBox = document.createElement("div")
        musicBox.className = "recMusicBox"

        const title = document.createElement("p")
        const content = document.createElement("p")
        title.className = "recMusic_title"
        content.className = "recMusic_content"
        title.innerHTML = res.songs[i].name;
        let artists = []
        for (let j = 0; j < res.songs[i].artists.length; j++) {
            artists.push(res.songs[i].artists[j].name)
        }
        content.innerHTML = artists.join("\\") + "-" + res.songs[i].album.name


        const play = document.createElement("img")
        play.className = "play"
        play.src = "../images/播放inSerachPage.png"

        musicBox.appendChild(title)
        musicBox.appendChild(content)

        box.appendChild(cover)
        box.appendChild(musicBox)
        box.appendChild(play)

        recommendPage.appendChild(box)
    }

    const recMusicBox = document.querySelectorAll(".recommendBox")
    for (let i = 0; i< recMusicBox.length; i++) {
        recMusicBox[i].addEventListener("click", async() => {
            window.localStorage.setItem("cloudId",res.songs[i].id)
            window.location.href="../html/song.html"
        })
    }
}


//评论
async function comment(num) {
    const com = await fetch("http://121.40.19.111:3000/comment/hot?type=0&id=" + id + "&limit=" + num)
    const res = await com.json()
    console.log(res.hotComments);
    if (res.hotComments[0]) {
        for (let i = 0; i < num; i++) {
            const comBox = document.createElement("div")
            comBox.className = "comBox"

            const head = document.createElement("div")
            head.className = "inforHead"

            const content = document.createElement("div")
            content.className = "comContent"

            const pic = document.createElement("img")
            pic.className = "pic"
            pic.src = res.hotComments[i].user.avatarUrl

            const box = document.createElement("div")
            box.className = "inforBox"


            const name = document.createElement("p")
            name.className = "username"
            name.innerHTML = res.hotComments[i].user.nickname

            const time = document.createElement("p")
            time.className = "time"
            time.innerHTML = res.hotComments[i].timeStr

            const like = document.createElement("div")
            like.className = "like"

            const p = document.createElement("p")
            p.innerHTML = res.hotComments[i].likedCount

            const img = document.createElement("img")
            img.className = "good"
            img.src = "../images/3.1点赞.png"

            like.appendChild(p)
            like.appendChild(img)

            box.appendChild(name)
            box.appendChild(time)

            head.appendChild(pic)
            head.appendChild(box)
            head.appendChild(like)

            content.innerHTML = res.hotComments[i].content

            comBox.appendChild(head)
            comBox.appendChild(content)

            commentPage.appendChild(comBox)
        }
    } else {
        const p = document.createElement("p")
        p.style.color = "white"
        p.innerHTML = "暂无热门评论"
        commentPage.appendChild(p)
    }

}

comment(8)
recommend()
getMusic()
Tongbu()