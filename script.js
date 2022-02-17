var blogArea = document.getElementById("blog-area");

var users = [{
    name: "John Doe",
    email: "john.doe@gmail.com",
    address: "Grbavicka",
    username: "johny",
    password: "7",
}]

var loggedUser = {};
var allBlogs = [];

function isUserLogged() {
    var userData = localStorage.getItem("loggedUser");
    if (userData) {
        var user = JSON.parse(userData)
        login(user.email, user.password)
    } else {
        var nav = document.getElementById("nav");
        nav.style.display = "block";
        blogArea.style.display = "block";

        var loginForm = document.getElementById("login-form");
        loginForm.style.display = "none";
        var name = document.getElementById("user-name");
        name.innerHTML = "Guest";
        displayBlog();
    }
}
isUserLogged();

function login(p_email, p_password) {
    var email = p_email || document.getElementById("email").value;
    var password = p_password || document.getElementById("password").value;
    var usersData = localStorage.getItem("users");
    if (usersData) {
        users = JSON.parse(usersData);

    }

    for (var user of users) {
        if ((email === user.email || email === user.username) && password === user.password) {
            var loginForm = document.getElementById("login-form");
            loginForm.style.display = "none";
            var nav = document.getElementById("nav");
            nav.style.display = "block";
            var blogArea = document.querySelector(".blog-area");
            blogArea.style.display = "block";
            var name = document.getElementById("user-name");
            name.innerHTML = user.name;
            loggedUser = user;
            localStorage.setItem("loggedUser", JSON.stringify(loggedUser));
            clearValue("email");
            clearValue("password");

        } else {
            var errorMsg = document.querySelector(".msg-error");
            errorMsg.style.display = "block";
        }
    }
    displayBlog();
}
function loginOnEnter(e) {
    if (e.keyCode === 13) {
        login();
    }

}
function logout() {
    var loginForm = document.getElementById("login-form");
    loginForm.style.display = "block";
    var nav = document.getElementById("nav");
    nav.style.display = "none";
    var blogArea = document.querySelector(".blog-area");
    blogArea.style.display = "none";
    document.querySelector(".msg-error").style.display = "none";
    loggedUser = {};
    localStorage.removeItem("loggedUser");

}
function goToSignUpForm() {
    var loginForm = document.getElementById("login-form");
    loginForm.style.display = "none";
    var signupForm = document.getElementById("singup-form");
    signupForm.style.display = "block";
}
function goToLoginForm() {
    var loginForm = document.getElementById("login-form");
    loginForm.style.display = "block";
    var signupForm = document.getElementById("singup-form");
    signupForm.style.display = "none";


}
function getValue(id) {
    return document.getElementById(id).value;
}
function clearValue(id) {
    document.getElementById(id).value = "";
}
function registerNow() {
    var name = getValue("name");
    var email = getValue("su-email");
    var address = getValue("address");
    var username = getValue("username");
    var password = getValue("su-password");
    // console.log(name, email, address, username, password);
    if (name === "" || email === "" || address === "" || username === "" || password === "") {
        return alert("Unesite sve podatke");
    }
    var user = {
        name: name,
        email: email,     // ili skraceno name,email...
        address: address,
        username: username,
        password: password
    }
    users.push(user);
    localStorage.setItem("users", JSON.stringify(users));
    clearValue("name");
    clearValue("su-email");
    clearValue("address");
    clearValue("username");
    clearValue("su-password");
    goToLoginForm();
    console.log(users);

}
function postBlog() {
    var blogTitle = getValue("blog-title");
    var blogDesc = getValue("blog-desc");

    if (blogTitle === "" || blogDesc === "") {
        return alert("Popunite sve podatke")
    };
    if (isGuest()) return alert("Molim Vas registrujte se!");

    var blog = {
        blogTitle,
        blogDesc,
        postDate: new Date(),
        author: loggedUser.username,
        comments: [],
        likes: [],
        dislikes: []
    }

    allBlogs.push(blog);
    localStorage.setItem("blogs", JSON.stringify(allBlogs));
    displayBlog()

    clearValue("blog-title");
    clearValue("blog-desc");
}
function displayBlog() {
    var blogsData = localStorage.getItem("blogs");
    if (blogsData) {
        allBlogs = JSON.parse(blogsData);
    }
    renderBlogs(allBlogs);
}
function renderBlogs(blogs, type = "allBlogs") {
    blogs.sort((a, b) => new Date(b.postDate) - new Date(a.postDate));
    var publishedBlogs;

    if (type == 'allBlogs') {
        publishedBlogs = document.getElementById("publisbed-blogs");
    } else {
        publishedBlogs = document.getElementById("published-userBlogs");
    }
    publishedBlogs.innerHTML = "";

    for (var blog of blogs) {
        var h3 = document.createElement("h3");
        h3.innerHTML = blog.blogTitle;
        h3.appendChild(createDeleteBtn(blog));
        h3.style.color = "white";
        var div = document.createElement("div");
        div.classList.add("posted-blog");
        var p = document.createElement("p");
        p.innerHTML = blog.blogDesc;

        var span = document.createElement("span");
        span.appendChild(showProfil(blog, blogs));

        // span.innerHTML = `<b>Author:</b> ${blog.author}`;
        // span.addEventListener("click", showProfil(blog))

        var datum = document.createElement("i");
        datum.style.paddingLeft = "30px";
        datum.innerHTML = new Date(blog.postDate).toLocaleString();
        div.appendChild(p);
        div.appendChild(span);
        div.appendChild(datum);
        div.appendChild(addLike(blog));


        publishedBlogs.appendChild(h3);
        publishedBlogs.appendChild(div);
        showComments(blog.comments)  //publishedblogs
        if (type == 'allBlogs') {
            publishedBlogs.appendChild(addComment(blog));
        }


    }
}
function searchBlogs(e) {
    var searcBy = e.target.value;
    var filteredBlogs = [];
    // console.log(searcBy);
    for (var blog of allBlogs) {
        if (blog.blogTitle.toLowerCase().indexOf(searcBy.toLowerCase()) > -1) {
            filteredBlogs.push(blog);
        }
    }
    renderBlogs(filteredBlogs);
}
function addComment(blog) {
    var input = document.createElement("input");
    input.placeholder = "Leave a comment..."
    input.style.width = "40%";
    input.style.marginTop = "20px";
    input.style.marginLeft = "60%";
    input.addEventListener("keyup", function (e) {
        var text = e.target.value;
        if (e.keyCode !== 13) return;
        if (isGuest()) return alert("Molim Vas registrujte se!")

        var comment = {
            text,
            author: loggedUser.name,
            postedDate: new Date()
        };
        if (!blog.comments) {
            blog.comments = [];
        }
        blog.comments.push(comment);
        localStorage.setItem("blogs", JSON.stringify(allBlogs));
        input.value = "";
        renderBlogs(allBlogs)

        // console.log(blog);
    })
    return input;
}
function showComments(comments) {   //parentEl
    var publishedBlogs = document.getElementById("publisbed-blogs");
    for (var comment of comments) {
        var div = document.createElement("div");
        div.classList.add("posted-blog");
        div.style = `width:40%; margin-left:60%; margin-top:8px; padding:5px 10px`;
        var p = document.createElement("p");
        p.innerHTML = comment.text;
        p.style.marginBottom = "5px";
        p.style.marginTop = "5px";
        var span = document.createElement("span");
        span.innerHTML = `<b>Author:</b> ${comment.author}`;
        span.style.fontSize = "14px"
        var datum = document.createElement("i");
        datum.style.paddingLeft = "30px";
        datum.innerHTML = new Date(comment.postedDate).toLocaleString();
        datum.style.fontSize = "14px;"
        div.appendChild(p);
        div.appendChild(span);
        div.appendChild(datum);
        publishedBlogs.appendChild(div);
    }
}
function createDeleteBtn(blog) {
    var btn = document.createElement("div");
    btn.innerHTML = `<i class="fas fa-trash-alt" style="font-size:16px;color:red;cursor:pointer"></i>`;
    btn.style.float = "right";
    btn.style.display = loggedUser.name === blog.author ? `block` : `none`;
    btn.addEventListener("click", function () {
        var index = allBlogs.indexOf(blog);
        var response = confirm("Jeste li sigurni da želite obrisati blog?")
        if (!response) return
        allBlogs.splice(index, 1);
        renderBlogs(allBlogs);
    })
    return btn;
}
function isGuest() {
    return !loggedUser.name;
}
function addLike(blog) {
    var id = allBlogs.indexOf(blog)
    var licon = isUserLiked(blog) ? `fas` : `far`;
    var dicon = isUserDisliked(blog) ? `fas` : `far`;
    var likeWrapper = document.createElement("div");
    likeWrapper.classList.add("like-dislike-icons");
    likeWrapper.innerHTML = isGuest() ? `` : `
    <span title="${blog.likes ? blog.likes.join(", ").toUpperCase() : 'Nema lajkova'}"  style="color:blue;">${blog.likes ? blog.likes.length : 0}</span>
    <i data-id="${id}" onclick="likeBlog(event)"  <i class="${licon} fa-thumbs-up"></i>
    <i data-id="${id}" onclick="dislikeBlog(event)" <i class="${dicon} fa-thumbs-down"></i>
    <span style="color:red;">${blog.dislikes ? blog.dislikes.length : 0}</span>
    `;
    return likeWrapper;
}
function likeBlog(e) {
    var index = e.target.getAttribute("data-id");
    var blog = allBlogs[index];
    if (!blog.likes) {
        blog.likes = [];
    }

    if (blog.likes.includes(loggedUser.username)) {
        var i = blog.likes.indexOf(loggedUser.username)
        blog.likes.splice(i, 1)
    } else
        blog.likes.push(loggedUser.username);
    localStorage.setItem("blogs", JSON.stringify(allBlogs));
    renderBlogs(allBlogs)

}
function dislikeBlog(e) {
    var index = e.target.getAttribute("data-id");
    var blog = allBlogs[index];
    if (!blog.dislikes) {
        blog.dislikes = [];
    }

    if (blog.dislikes.includes(loggedUser.username)) {
        var i = blog.dislikes.indexOf(loggedUser.username)
        blog.dislikes.splice(i, 1)
    } else
        blog.dislikes.push(loggedUser.username);
    localStorage.setItem("blogs", JSON.stringify(allBlogs));
    renderBlogs(allBlogs)
}
function isUserLiked(blog) {
    if (!blog.likes) return
    if (blog.likes.includes(loggedUser.username)) return true;
    return
}
function isUserDisliked(blog) {
    if (!blog.dislikes) return
    if (blog.dislikes.includes(loggedUser.username)) return true;
    return
}
function showProfil(blog, blogs) {
    var usersData = JSON.parse(localStorage.getItem("users"));
    var span = document.createElement("span");
    span.innerHTML = `<b>Author:</b> ${blog.author}`;
    span.classList.add("profil");

    span.addEventListener("click", function (e) {
        //pronadji usera
        for (var userData of usersData) {
            console.log("userData ", userData)
            if (userData.username === blog.author) {
                var name = userData.name;
                var email = userData.email;
                var address = userData.address;
            }
        };

        //pronadji sve blogove od ovog korinika
        var userBlogs = [];
        for (var userBlog of blogs) {
            //console.log("userData ", userData)
            if (userBlog.author === blog.author) {
                userBlogs.push(userBlog);
            }
        };

        //sakrij login blogs nav
        var loginForm = document.getElementById("login-form");
        loginForm.style.display = "none";
        var nav = document.getElementById("nav");
        nav.style.display = "none";
        var blogArea = document.querySelector(".blog-area");
        blogArea.style.display = "none";

        //napravi html za profil
        var profilWrapper = document.getElementById("profil-wrapper");
        profilWrapper.style.display = "block";
        var usersPhoto = document.createElement("p");

        usersPhoto.innerHTML = "Users Photo";
        var img = document.createElement("img");
        img.src = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQonIaaaHWdaaX1XD6FM1RUe6ZU000KDDw1gsJto7DZrGnE8rXxQ6xSmyoL6isuqlGhNeQ&usqp=CAU"
        var username = document.createElement("p");
        username.innerHTML = `Username: ${blog.author}`;
        var fullName = document.createElement("p");
        fullName.innerHTML = `Full Name: ${name}`;
        var add = document.createElement("p");
        add.innerHTML = `Address: ${address}`;
        var mail = document.createElement("p");
        mail.innerHTML = `Email: ${email}`
        var btnCloseProfil = document.createElement("button");
        var userBlog = document.createElement("div");
        userBlog.setAttribute("id", "published-userBlogs");
        btnCloseProfil.innerHTML = "Close Profil";
        btnCloseProfil.addEventListener("click", function () {
            // prikazi blogove
            var nav = document.getElementById("nav");
            nav.style.display = "block";
            var blogArea = document.querySelector(".blog-area");
            blogArea.style.display = "block";
            // sakrij profil
            profilWrapper.innerHTML = "";
            profilWrapper.style.display = "none";
        })
        profilWrapper.appendChild(usersPhoto);
        profilWrapper.appendChild(img);
        profilWrapper.appendChild(username);
        profilWrapper.appendChild(fullName);
        profilWrapper.appendChild(add);
        profilWrapper.appendChild(mail)
        profilWrapper.appendChild(btnCloseProfil);
        profilWrapper.appendChild(userBlog);
        profilWrapper.style.color = "white";

        renderBlogs(userBlogs, 'userBlogs');


    })
    return span;



};

