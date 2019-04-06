const convertBtn = document.getElementById("download-btn");
convertBtn.addEventListener("click", () => {
    const videoURL = document.getElementById("download-input").value;
    const formatInfo = document.querySelector("input[name='videoFormat']:checked").value;
    fetchMetaInfo(videoURL);
    const isValid = isValidYtUrl(videoURL);
    if (!isValid) {
        throw new Error("Invalid url!");
    }
    sendURL(videoURL, formatInfo);
});
const sendURL = (url, format) => {
    window.location.href = `http://localhost:4000/download?URL=${url}&FORMAT=${format}`;
};
const isValidYtUrl = (url) => {
    const ytRegex = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(\?\S*)?$/;
    return url.match(ytRegex);
};
const fetchMetaInfo = (videoURL) => {
    fetch("/metainfo", {
        method: "POST", headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ videoURL })
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error("Request failed.");
        })
        .then((metainfo) => {
            const metaTitle = document.getElementById("meta-title");
            if (metainfo.fail) {
                metaTitle.innerText = "Video URL is not valid!";
                return;
            }
            metaTitle.innerHTML = metainfo.title;
            const metaThumbnail = document.getElementById("meta-thumbnail");
            metaThumbnail.src = metainfo.thumbnail_url;
        })
        .catch((err) => {
            throw err;
        });
};