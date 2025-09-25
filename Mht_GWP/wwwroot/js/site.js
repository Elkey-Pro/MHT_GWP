document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.getElementById('videoPlayer');

    function resizeVideo() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        video.style.width = `${width}px`;
        video.style.height = `${height}px`;
    }

    video.addEventListener('play', () => {
        console.log('Video is playing');
    });

    video.addEventListener('pause', () => {
        console.log('Video is paused');
    });

    video.addEventListener('ended', () => {
        console.log('Video has ended');
        // Increment the open count and save it in a cookie
        incrementOpenCount();
        // Redirect to another website after video ends
        window.location.href = 'https://nuiphaomining.sharepoint.com';
    });

    // Function to set a cookie with expiration after 24 hours
    function setCookie(name, value) {
        const now = new Date();

        // Set the cookie expiration after 24 hours
        const expireTime = new Date(now.getTime() + (24 * 60 * 60 * 1000)); // Expire after 24 hours
        document.cookie = `${name}=${value};expires=${expireTime.toUTCString()};path=/;SameSite=Lax`;
        console.log('Cookie set, expires at: ' + expireTime);
    }

    // Function to get a cookie by name
    function getCookie(name) {
        const cname = name + "=";
        const decodedCookie = decodeURIComponent(document.cookie);
        const ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(cname) == 0) {
                return c.substring(cname.length, c.length);
            }
        }
        return "";
    }

    // Function to increment the open count and store it in a cookie
    function incrementOpenCount() {
        let openCount = getCookie("GWPopenCount");
        if (openCount != "") {
            openCount = parseInt(openCount) + 1;
        } else {
            openCount = 1;
        }
        setCookie("GWPopenCount", openCount); // Save cookie for 1 year
        console.log("Page opened " + openCount + " times");
    }

    // Function to check play record count and play video accordingly
    function checkPlayRecordCount() {
        let playCount = getCookie("GWPopenCount");
        if (playCount === "" || playCount === "0") {
            // If it's the first time, check if video file exists and then play
            checkVideoFile(video.src, function (exists) {
                if (exists) {
                    // Video exists, play it from cache after loading
                    checkVideoPlayed();
                } else {
                    // If video file doesn't exist, redirect
                    window.location.href = 'https://nuiphaomining.sharepoint.com';
                }
            });
        } else {
            // If playCount exists, skip video and redirect
            window.location.href = 'https://nuiphaomining.sharepoint.com';
        }
    }

    // Function to check if video file exists (no need to check repeatedly)
    function checkVideoFile(url, callback) {
        // Assuming video exists, since it's static and hosted on the same domain
        callback(true);
    }

    // Function to check if video has been played before
    function checkVideoPlayed() {
        let videoPlayed = getCookie("video_played");
        if (videoPlayed === "1") {
            // If cookie exists, just play video from cache
            video.load(); // Force reloading from cache
            video.play();
        } else {
            // If video has not been played, load from server and set cookie after video ends
            video.load();
            video.play();
            video.addEventListener("ended", () => {
                setCookie("video_played", "1"); // Set cookie to prevent reloading video
                window.location.href = 'https://nuiphaomining.sharepoint.com'; // Redirect after video ends
            });
        }
    }

    // Set initial video size and adjust on window resize
    resizeVideo();
    window.addEventListener('resize', resizeVideo);

    // Check play record count and video status on page load
    checkPlayRecordCount();
});
