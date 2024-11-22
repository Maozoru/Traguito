document.addEventListener("DOMContentLoaded", function () {
    const navbarSecondary = document.getElementById("navbarSecondary");
    let lastScrollTop = 0;
    let isThrottled = false; // Evita ejecutar el código demasiadas veces

    // Función que maneja el scroll
    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        if (scrollTop < 20 || scrollTop < lastScrollTop) {
            navbarSecondary.classList.add("visible");
        } else {
            navbarSecondary.classList.remove("visible");
        }

        lastScrollTop = scrollTop; // Actualizar la posición previa
    };

    // Throttle para limitar la ejecución de handleScroll
    window.addEventListener("scroll", function () {
        if (!isThrottled) {
            handleScroll();
            isThrottled = true;
            setTimeout(() => {
                isThrottled = false;
            }, 100);
        }
    });
});
