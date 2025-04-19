function initialize() {
    document.addEventListener(
        "nowPage",
        () => {
            getStatus("https://api.github.com/repos/cyn1x/Iconoclast/commits/main", "iconoclast-latest-commit");
            getStatus("https://api.github.com/repos/cyn1x/libcspd/commits/main", "libcspd-latest-commit");
            getStatus("https://api.github.com/repos/cyn1x/rchess/commits/master", "rchess-latest-commit");
        },
        false
    );
}

function getStatus(url, id) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const repo = document.getElementById(id);
            createLink(repo, data);
        })
        .catch(error => console.error("Error fetching latest commit:", error));
}

function createLink(latestCommit, data) {
    latestCommit.textContent = "";
    const hash = data.sha.substring(0, 7);
    var a = document.createElement('a');
    var linkText = document.createTextNode(hash);
    a.appendChild(linkText);
    a.title = hash;
    a.href = data.html_url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    latestCommit.appendChild(a);
}

initialize();
