const listNames = document.querySelectorAll(".cover")
const upadates = document.querySelectorAll(".update")
const musicBox = document.querySelectorAll(".musicBox")

async function list() {
    const list = await fetch("http://121.40.19.111:3000/toplist/detail")
    const res = await list.json()
    console.log(res.list);

    for (let i = 0; i < 4; i++) {
        listNames[i].innerHTML = res.list[i].name
        upadates[i].innerHTML = res.list[i].updateFrequency

        musicBox.className = "musicBox"
        for (let j = 0; j < 3; j++) {
            const p = document.createElement("p")
            p.innerHTML = j + 1 + "." + res.list[i].tracks[j].first + "-" + res.list[i].tracks[j].second
            musicBox[i].appendChild(p)
        }
    }
    listNames[0].style.backgroundImage = "linear-gradient(225deg, rgb(246, 148, 186), rgb(177, 59, 120))"
    listNames[1].style.backgroundImage = "linear-gradient(45deg, rgb(53,167,177), rgb(136,219,201))"
    listNames[2].style.backgroundImage = "linear-gradient(45deg, rgb(213,66,59), rgb(244,163,146))"
    listNames[3].style.backgroundImage = "linear-gradient(45deg, rgb(86,135,202), rgb(126,209,242))"

    const lists = document.querySelectorAll(".lists")
    for (let i = 0; i < 4; i++) {
        lists[i].addEventListener("click", async() => {
            window.localStorage.setItem("listid", res.list[i].id)
            window.location.href = "../html/list.html"
        })
    }
}

list()