const list = document.querySelector(".listmusic")
const id = window.localStorage.getItem("listid")
async function getList(id) {
    const get = await fetch("http://121.40.19.111:3000/playlist/track/all?id=" + id)
    const res = await get.json()
    console.log(res);
    document.querySelector("#all").innerHTML = "(共"+res.songs.length+"首)"
    for (let i = 0; i < res.songs.length; i++) {
        const musicBox = document.createElement("div")
        musicBox.className = "musicBox"

        const num = document.createElement("p")
        num.className = "num"
        num.innerHTML = i + 1

        const box = document.createElement("div")
        box.className = "box"

        const title = document.createElement("p")
        title.className = "title"
        title.innerHTML = res.songs[i].name

        const content = document.createElement("p")
        content.className = "content"
        let artists = []
        for (let j = 0; j < res.songs[i].ar.length; j++) {
            artists.push(res.songs[i].ar[j].name)
        }
        content.innerHTML = artists.join("\\") + "-" + res.songs[i].al.name

        const img = document.createElement("img")
        img.src = "../images/播放inSerachPage.png"

        box.appendChild(title)
        box.appendChild(content)

        musicBox.appendChild(num)
        musicBox.appendChild(box)
        musicBox.appendChild(img)


        musicBox.appendChild(img)

        list.appendChild(musicBox)
    }
    const boxs = document.querySelectorAll(".musicBox")

    for (let i = 0; i < res.songs.length; i++) {
        boxs[i].addEventListener("click", async() => {
            window.localStorage.setItem("cloudId",res.songs[i].id)
            window.location.href="../html/song.html"
        })
    }
}

async function getName(id) {
    const get = await fetch("http://121.40.19.111:3000/playlist/detail?id=" + id)
    const res = await get.json()
    document.getElementById("title").innerHTML = res.playlist.name
    document.getElementById("content").innerHTML = res.playlist.description
    document.getElementById("bg").src = res.playlist.coverImgUrl
    document.getElementById("cover").src = res.playlist.coverImgUrl
}

document.getElementById("btn_back").addEventListener("click", async () => {
    window.location.href="../html/index.html"
})

getList(id)
getName(id)