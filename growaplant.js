//chosen pot and flower
let chosenPot=null;
let chosenFlower=null;
let growthStage=0;
let isAnimating= false;

//timing bar
let timingBarPosition = 0; // 0 to 1
let timingBarDirection = 1; // 1 for right, -1 for left
let timingBarSpeed = 0.02; // speed of the bar movement
let timingBarAnimationId = null;
let isTimingBarActive = false;
const greenZoneStart = 0.7; // green zone starts at 70%
const greenZoneEnd = 0.85; // green zone ends at 85%
// sparkles animation
let sparklesAnimationId = null;
let sparklesFrame = 1;

//background scaling
const container= document.getElementById("gamecontainer");

function resizeGame(){
    const scaleX = Math.floor(window.innerWidth / 70);
    const scaleY = Math.floor(window.innerHeight / 85);
    const scale = Math.min(scaleX, scaleY);
    container.style.transform = `scale(${scale})`;
}

window.addEventListener("resize", resizeGame);
resizeGame();

const plantGrowthFrames={
    "sprout1.png": [
        ["images/flower1_animation/phase1/flower1_p1-1.png","images/flower1_animation/phase1/flower1_P1-2.png","images/flower1_animation/phase1/flower1_p1-3.png","images/flower1_animation/phase1/flower1_small.png"],
        ["images/flower1_animation/phase2/flower1_p2-1.png","images/flower1_animation/phase2/flower1_p2-2.png","images/flower1_animation/phase2/flower1_p2-3.png","images/flower1_animation/phase2/flower1_middle.png"],
        ["images/flower1_animation/phase3/flower1_p3-1.png","images/flower1_animation/phase3/flower1_p3-2.png","images/flower1_animation/phase3/flower1_p3-3.png","images/flower1_animation/phase3/flower1_final.png"],
    ],
    "sprout2.png": [
        ["images/flower2_animation/phase1/flower2_p1-1.png","images/flower2_animation/phase1/flower2_p1-2.png","images/flower2_animation/phase1/flower2_p1-3.png","images/flower2_animation/phase1/flower2_small.png"],
        ["images/flower2_animation/phase2/flower2_p2-1.png","images/flower2_animation/phase2/flower2_p2-2.png","images/flower2_animation/phase2/flower2_p2-3.png","images/flower2_animation/phase2/flower2_middle.png"],
        ["images/flower2_animation/phase3/flower2_p3-1.png","images/flower2_animation/phase3/flower2_p3-2.png","images/flower2_animation/phase3/flower2_p3-3.png","images/flower2_animation/phase3/flower2_final.png"],
    ],
    "sprout3.png": [
        ["images/flower3_animation/phase1/flower3_p1-1.png","images/flower3_animation/phase1/flower3_p1-2.png","images/flower3_animation/phase1/flower3_p1-3.png", "images/flower3_animation/phase1/flower3_small.png"],
        ["images/flower3_animation/phase2/flower3_p2-1.png", "images/flower3_animation/phase2/flower3_p2-2.png","images/flower3_animation/phase2/flower3_p2-3.png", "images/flower3_animation/phase2/flower3_middle.png"],
        ["images/flower3_animation/phase3/flower3_p3-1.png","images/flower3_animation/phase3/flower3_p3-2.png","images/flower3_animation/phase3/flower3_p3-3.png","images/flower3_animation/phase3/flower3_final.png"],
    
    ],
    "sprout4.png": [
        ["images/flower4_animation/flower4_p1-1.png","images/flower4_animation/flower4_p1-2.png","images/flower4_animation/flower4_p1-3.png","images/flower4_animation/flower4_small.png"],
        ["images/flower4_animation/flower4_p2-1.png","images/flower4_animation/flower4_p2-2.png", "images/flower4_animation/flower4_p2-3.png","images/flower4_animation/flower4_middle.png"],
        ["images/flower4_animation/flower4_p3-1.png","images/flower4_animation/flower4_p3-2.png", "images/flower4_animation/flower4_p3-3.png","images/flower4_animation/flower4_final.png"],
    ]


}



//chosen pot
function choosePot(potFile) {
    chosenPot = potFile;

    const potImage = document.getElementById("potImage");
    potImage.src = "images/flower_pot/" + potFile;
    potImage.style.display = "block";

    // entering grow screen: ensure timing UI and stop sparkles
    const timingImg = document.getElementById("timingBarImage");
    if (timingImg) timingImg.style.display = "block";
    const bar = document.getElementById("bar");
    if (bar) bar.style.display = "none";
    stopSparkles();

    goto("growScreen");
}


//chosen flower
function chooseFlower(flowerFile) {
    chosenFlower = flowerFile;

    const flowerImage = document.getElementById("flowerImage");
    flowerImage.src = "images/flower_sprout/" + chosenFlower;
    flowerImage.style.display = "block";

    goto("flowerpotScreen");
}

//go to next screen
function goto(screenId){
    // get all elements with class "screen"
    const screens = document.querySelectorAll(".screen");

    // hide all screens
    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    // show the requested screen
    document.getElementById(screenId).classList.add("active");
}

function startTimingBar() {
    if (isAnimating || growthStage >= 3) return;
    
    isTimingBarActive = true;
    timingBarPosition = 0;
    timingBarDirection = 1;
    
    const bar = document.getElementById("bar");
    bar.style.display = "block";
    
    timingBarAnimationId = setInterval(() => {
        timingBarPosition += timingBarDirection * timingBarSpeed;
        
        if (timingBarPosition >= 1) {
            timingBarPosition = 1;
            timingBarDirection = -1;
        } else if (timingBarPosition <= 0) {
            timingBarPosition = 0;
            timingBarDirection = 1;
        }
        
        // Move the timing bar indicator
        // Reduced by 3px on both sides: left starts at 8px (5+3), range is 54px (60-6)
        bar.style.left = (8 + timingBarPosition * 54) + "px";
    }, 30);
}

function stopTimingBar() {
    if (timingBarAnimationId) {
        clearInterval(timingBarAnimationId);
        timingBarAnimationId = null;
    }
    isTimingBarActive = false;
    const bar = document.getElementById("bar");
    bar.style.display = "none";
}

function startSparkles() {
    const spark = document.getElementById("sparkles");
    if (!spark) return;
    sparklesFrame = 1;
    spark.src = "images/sparkles_1.png";
    spark.style.display = "block";
    if (sparklesAnimationId) clearInterval(sparklesAnimationId);
    sparklesAnimationId = setInterval(() => {
        sparklesFrame = sparklesFrame === 1 ? 2 : 1;
        spark.src = `images/sparkles_${sparklesFrame}.png`;
    }, 300);
}

function stopSparkles() {
    if (sparklesAnimationId) {
        clearInterval(sparklesAnimationId);
        sparklesAnimationId = null;
    }
    const spark = document.getElementById("sparkles");
    if (spark) spark.style.display = "none";
}

function isInGreenZone() {
    return timingBarPosition >= greenZoneStart && timingBarPosition <= greenZoneEnd;
}

function attemptGrow() {
    if (!isTimingBarActive) {
        startTimingBar();
        return;
    }
    
    if (isInGreenZone()) {
        stopTimingBar();
        growOnce();
    }
    // If not in green zone, do nothing and let bar continue
}

function growOnce() {
    if (isAnimating) return;
    if (growthStage >= 3) return; // already fully grown

    isAnimating=true;

    const flowerImage = document.getElementById("flowerImage");

    // get the frame set for this flower and stage
    const frames = plantGrowthFrames[chosenFlower][growthStage];

    let frameIndex=0;
    // frames[3] is the resting image of the next stage
    const interval =setInterval(() =>{
        flowerImage.src = frames[frameIndex];
        frameIndex++;

        if (frameIndex>=frames.length){
            clearInterval(interval);
            growthStage++;
            isAnimating=false;
            // Auto-start timing bar for next growth, or show sparkles on final
            if (growthStage < 3) {
                startTimingBar();
            } else {
                // final growth reached: hide timing UI and show sparkles
                stopTimingBar();
                const timingImg = document.getElementById("timingBarImage");
                if (timingImg) timingImg.style.display = "none";
                startSparkles();
            }
        }
    }, 200);
}

// Event listeners for timing bar
document.getElementById("growScreen").addEventListener("click", attemptGrow);
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        e.preventDefault();
        attemptGrow();
    }
});