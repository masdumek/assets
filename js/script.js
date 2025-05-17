async function ___(u) {
  try {
    const r = await fetch(u);
    return await r.json();
  } catch (e) {
    return null;
  }
}

function ucwords(str) {
  let s = [];
  str
    .toLowerCase()
    .split(" ")
    .forEach((a) => {
      if (a.length > 1) {
        a = a[0].toUpperCase() + a.slice(1);
      }
      s.push(a);
    });
  return s.join(" ");
}

(async () => {
  const elLoader = document.getElementById("__loader");
  const elTitle = document.getElementById("__title");
  const elContent = document.getElementById("__content");
  const elRelated = document.getElementById("__related");
  const elHomepage = document.getElementById("__homepage");

  const loc = window.location;
  const apiHost = "https://elastic-illustrious-telescope.glitch.me";
  let slug = null;
  let path = "/";
  if (loc.pathname !== "/") {
    slug = loc.pathname.slice(9).split(".html")[0];
  }

  if (loc.search.startsWith(pathRule)) {
    slug = loc.search.split(pathRule)[1];
  }

  if (slug) {
    elHomepage.remove();
    elLoader.innerHTML = "Loading data...";

    if (slug.indexOf("&m=") > 0) slug = slug.split("&m=")[0];
    slug = decodeURIComponent(slug.replace(/\-+/g, " "));

    const params = new URLSearchParams({
      q: decodeURIComponent(slug),
      o: loc.origin,
      p: 15,
      n: 1000,
    });

    document.title = ucwords(slug);
    await ___(apiHost + "/run?" + params).then((data) => {
      if (data) {
        let related = "";
        if (data.related.length > 0) {
          data.related.forEach((r) => {
            const liHref = r.replace(/\s+/g, "-").toLowerCase();
            const li = `<li class="Tags-item u-background"><a class="Tags-link u-clickable" rel="tag" href="${path}?r=${decodeURIComponent(
              liHref
            )}">${decodeURIComponent(r)}</a></li>`;
            related += li;
          });
        }

        document.querySelector('meta[name="description"]').content =
          data.description;

        elTitle.innerHTML = decodeURIComponent(data.title);
        elContent.innerHTML = data.body;
        elRelated.innerHTML = related;

        elLoader.remove();
        document.getElementsByTagName("article")[0].style.display = "block";
      } else {
        elLoader.innerHTML = "<h1>404 | Not Found</h1>";
      }
    });
    return;
  }

  keywords = keywords.split(",").filter((x) => x);
  let __c = "";
  keywords.forEach((k, i) => {
    const liHref = k.replace(/\s+/g, "-").toLowerCase();
    __c += `<li class="Tags-item u-background"><a rel="bookmark" class="Tags-link u-clickable" href="/?r=${liHref}">${ucwords(
      k
    )}</a></li>`;
  });

  elLoader.remove();
  elHomepage.innerHTML = __c;
})();
