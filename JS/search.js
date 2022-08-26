const hot_rank = document.querySelector(".hot_rank")
const search_box = document.querySelector("#search_box")
const searchFeedback = document.querySelector(".search")
const X = document.querySelector("#cancel")

X.addEventListener("click", () => {
    searchFeedback.style.display = "none";
    X.style.display = "none";
    hot_rank.style.display = "block"
    search_box.value = ""
})


async function hotRank() {
    const hotRank = await fetch("http://121.40.19.111:3000/search/hot/detail", {
        method: "GET",
        headers: {}
    })
    const res = await hotRank.json()

    for (let i = 0; i < res.data.length; i++) {
        const box = document.createElement("div")
        box.className = "hr_content"
        const rank = document.createElement("p")
        rank.className = "rank"
        rank.innerHTML = i + 1;
        box.appendChild(rank);

        const musicBox = document.createElement("span")
        musicBox.className = "searchRes_box"

        const title = document.createElement("p")
        title.className = "title"
        title.innerHTML = res.data[i].searchWord

        const content = document.createElement("p")
        content.className = "sr_content";
        content.innerHTML = res.data[i].content

        musicBox.appendChild(title)
        musicBox.appendChild(content)
        box.appendChild(musicBox)

        const number = document.createElement("p")
        number.className = "number"
        number.innerHTML = res.data[i].score
        box.appendChild(number)

        // box.addEventListener("click", search(title.innerHTML))

        hot_rank.appendChild(box)
    }
    const titles = document.querySelectorAll(".title")
    const boxs = document.querySelectorAll(".hr_content")
    for (let i = 0; i < boxs.length; i++) {
        boxs[i].addEventListener("click", async () => {
            search(titles[i].innerHTML)
        })
    }
}

hotRank()

async function search(value) {
    search_box.value = value
    const search = await fetch("http://121.40.19.111:3000/search?keywords=" + value)
    const res = await search.json()
    console.log(res.result.songs);
    if(value != "") {
        X.style.display = "block";
    }

    hot_rank.style.display = "none"
    searchFeedback.style.display = "block"
    
    // dom操作
    while (searchFeedback.hasChildNodes()) //清屏
    {
        searchFeedback.removeChild(searchFeedback.firstChild);
    }
    for (let i = 0; i < res.result.songs.length; i++) {
        const bigBox = document.createElement("div");
        bigBox.className = "searchFeedback"
        const box = document.createElement("span")
        box.className = "fbs"
        const title = document.createElement("p")
        title.className = "sb_title"
        title.innerHTML = res.result.songs[i].name
        const content = document.createElement("p")
        content.className = "sb_content"
        let artists = []
        for (let j = 0; j < res.result.songs[i].artists.length; j++) {
            artists.push(res.result.songs[i].artists[j].name)
        }
        content.innerHTML = artists.join("\\") + "-" + res.result.songs[i].album.name
        box.appendChild(title)
        box.appendChild(content)

        const img = document.createElement("img");
        img.src = "../images/播放inSerachPage.png"
        img.className = "playBtn"

        bigBox.appendChild(box)
        bigBox.appendChild(img)
        searchFeedback.appendChild(bigBox)

    }
}

async function keydown(event) {
    if (event.keyCode == 13) {

        // 切换视图
        hot_rank.style.display = "none";
        searchFeedback.style.display = "block";
        search(search_box.value)
    }
}

document.addEventListener("keydown", keydown);