feather.replace();

const sections = document.querySelectorAll('.section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 50,
            sectionId = current.getAttribute('id')

        if(sectionId !== "particle-canvas"){
            if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
                document.querySelector('.nav-item[href*=' + sectionId + ']').classList.add('active_link')
            }else{
                document.querySelector('.nav-item[href*=' + sectionId + ']').classList.remove('active_link')
            }
        }
    })
}

window.addEventListener('scroll', scrollActive)