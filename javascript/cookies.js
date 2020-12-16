// Saves a cookie with given name and value. Used for saving player's best time and wave.
function saveCookie(name, value) {
    var d = new Date();
    d.setTime(d.getTime() + 365 * 24 * 60 * 60 * 1000);
    //var expiry = new Date(d.getFullYear() + 1, d.getMonth(), d.getDate()); // setting the expiry date a year after
    document.cookie = name + "=" + value + "; expires=" + d.toUTCString() + "; path=/";
}

// Reads cookie value for given name. Used for reading player's best time and wave.
function readCookie(name) {
    var cookieName = name + "=";
    var cookies = decodeURIComponent(document.cookie);
    var cookieArray = cookies.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }

    return "0";
}