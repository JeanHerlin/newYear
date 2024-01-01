
window.addEventListener('load',()=>{
    const htmlYear = document.getElementById('year')
    htmlYear.innerText = new Date().getFullYear()

    const canvas = document.getElementById('canvas1')
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    let madaFlagaColors = ['#fff','#00cc25','#ff0000'];

    const canvas2 = document.getElementById('canvas2')
    const ctx2 = canvas2.getContext('2d')

    class Particle {

        /******** Handling the particles in the big text of Year *********/
        constructor(effect, x, y, color){
            this.effect = effect
            this.x = 0;
            this.y = 0;
            this.color = color;
            this.originX = x;
            this.originY = y
            this.size = this.effect.gap
            this.dx = 0
            this.dy = 0
            this.vx = 0
            this.vy = 0;
            this.force =0
            this.angle = 0
            this.distance = 0
            this.friction = Math.random() * 0.6 + 0.15
            this.ease = Math.random() * 0.1 + 0.005
        }
        draw(){
            this.effect.context.beginPath();
            this.effect.context.fillStyle = this.color
            // this.effect.context.fillRect(this.originX,this.originY,this.size,this.size)
            this.effect.context.arc(this.originX,this.originY,this.size,0,Math.PI * 2)
            this.effect.context.fill()
        }
    }

    class Effect{
        constructor(context, canvasWidth, canvasHeight){
            this.context = context;
            this.canvasWidth = canvasWidth
            this.canvasHeight = canvasHeight
            this.textX = this.canvasWidth/2
            this.textY = this.canvasHeight/2
            this.fontSize = 100
            this.maxtextWidth = this.canvasWidth * 0.9
            this.lineHeight = this.fontSize;

            //Particles
            this.particles = [];
            this.gap = 2;
        }

        // Making the big text of The Year responsive
        wrapText(text){
            this.context.fillStyle = 'rgb(255, 255, 255)'
            this.context.strokeStyle = 'rgb(255, 255, 255)'
            this.context.font = this.fontSize+"px Helvetica"
            this.context.textAlign = 'center'
            this.context.textBaseline = "middle" 

            let linesArray = []
            let lineCounter = 0;
            let line = ''
            let words = text.split(' ')
            for(let i=0;i<words.length;i++){
                let testLine = line + words[i] + ' '
                if(this.context.measureText(testLine).width > this.maxtextWidth){
                    line = words[i] + ' '
                    lineCounter++;
                }else{
                    line = testLine
                }
                linesArray[lineCounter] = line
            }
            let textHeight = this.lineHeight*lineCounter;
            this.textY = this.canvasHeight/2 - textHeight/2
            linesArray.forEach((el,index)=>{
                this.context.fillText(el,this.canvasWidth/2,this.textY + (index * this.lineHeight))
                this.context.strokeText(el,this.canvasWidth/2,this.textY + (index * this.lineHeight))
            })

            this.convertToParticles()
        }

        /****** THis Method convert the big Text of the Year into particles **********/
        convertToParticles(){
            this.particles = []
            const pixels = this.context.getImageData(0, 0 , this.canvasWidth, this.canvasHeight).data
            this.context.clearRect(0,0,this.canvasWidth,this.canvasHeight)
            for(let y=0 ; y<this.canvasHeight ; y+=this.gap ){
                for(let x=0 ; x<this.canvasWidth ; x+=this.gap ){
                    const index = (y * this.canvasWidth + x) * 4
                    const alpha = pixels[index + 3]
                    if(alpha > 0){
                        const red = pixels[index]
                        const green = pixels[index + 1]
                        const blue = pixels[index + 2]
                        // const color = 'rgb('+red+','+green+','+blue+')'
                        const color = madaFlagaColors[Math.floor(Math.random() * 3)]
                        this.particles.push(new Particle(this,x,y,color))
                    }
                }
            }

        }
        /** Render particles of the text ****/
        render(){
            this.particles.forEach(particle=>{
                particle.draw()
            })
        }
    }

    const effect = new Effect(ctx2, canvas2.width, canvas2.height)
    effect.wrapText(`${new Date().getFullYear()}`)
    effect.render()

    
    window.addEventListener("resize",()=>{
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
    })




 /********  Handling firework simulation ************/

 /* Array of particle in firwork simulation */
 let particlesArray = []

const mouse = {
    x:undefined,
    y:undefined
}

canvas.addEventListener('click',(e)=>{
    mouse.x = e.offsetX;
    mouse.y = e.offsetY

    for(let i=0;i<40;i++){
        particlesArray.push(new Firewokparticle())
    }
})

canvas.addEventListener('mousemove', (e)=>{
    mouse.x = e.offsetX;
    mouse.y = e.offsetY
        
    for(let i=0;i<10;i++){
        particlesArray.push(new Firewokparticle())
    }
})

class Firewokparticle {
    constructor(){
        this.x = mouse.x
        this.y = mouse.y
        this.size = Math.random() * 5 + 1;
        this.speedX = Math.random() * 3 -1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = madaFlagaColors[Math.floor(Math.random() * 3)]
    }

    /* Updating direction of particle and size*/
    update(){
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.size > 0.2) this.size -=0.1
        
    }

    /* Drawing particles */
    draw(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI * 2)
        ctx.fill()
    }
}

function handleParticles(){
    for(let i=0;i<particlesArray.length;i++){
        particlesArray[i].update()
        particlesArray[i].draw()
        
        if(particlesArray[i].size<0.3){
            particlesArray.splice(i,1)
            i--;
        }
       
    }
}

handleParticles()

 /* Animation loop that simulate the transparency and the disappearance of particles*/
function animate(){
    ctx.fillStyle = "rgba(0,0,0,0.2)"
    ctx.fillRect(0,0, canvas.width,canvas.height)
    handleParticles()
    requestAnimationFrame(animate)
}

animate()

})





































