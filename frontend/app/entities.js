
/*
    Base entity class, can be used as a base for other drawable objects, used for drawing and checking basic collisions

    IMPORTANT: Make sure to assign it an img variable after instantiating

    Common way to use it:

    let myObject;
    ...
    myObject = new Entity(x, y);
    myObject.img = myImage;

    ...

    draw(){
        ...

        myObject.render();
    }

    If you want to check for collisions with another Entity:

    if(myObject.collisionWith(anotherObject)){
        //do stuff
    }
    
*/
class Entity {
    constructor(x, y) {
        this.pos = createVector(x, y);
        this.rotation = 0;
        this.img; //Assign this after instantiating
        this.sizeMod = 1; //Size multiplier on top of objSize
        this.removable = false;
        this.scale = createVector(1, 1);
    }


    render() {
        let size = objSize * this.sizeMod;

        push();
        translate(this.pos.x, this.pos.y);
        rotate(this.rotation);
        scale(this.scale.x, this.scale.y);
        image(this.img, -size / 2, -size / 2, size, size);
        pop();

        
        
    }

    //Basic circle collision
    collisionWith(other) {
        let distCheck = (objSize * this.sizeMod + objSize * other.sizeMod) / 2;

        if (dist(this.pos.x, this.pos.y, other.pos.x, other.pos.y) < distCheck) {
            return true;
        } else {
            return false;
        }
    }

    checkClick(){
        return (mouseX > this.pos.x - this.sizeMod * objSize / 2
        && mouseX < this.pos.x + this.sizeMod * objSize /2
        && mouseY > this.pos.y - this.sizeMod * objSize / 2
        && mouseY < this.pos.y + this.sizeMod * objSize /2);
    }

}

class BaseObject extends Entity {
    constructor(x,y, type){
        super(x,y);

        this.type = type;

        this.img = imgDraggable[type];
       
        this.sizeMod = 3;

    }
}

class Draggable extends Entity{
    constructor(x, y, type){
        super(x, y);

        this.img = imgDraggable[type];
        this.defaultSize = 2;
        this.goalSize = this.defaultSize;
        this.sizeMod = 0.1;

        this.goalVelocity = createVector(0, 0);
        this.velocity = createVector(0, 0);

        this.moveSpeed = 2;
        this.moveTimer = 2;
        this.collided = false;

    }

    update(){
        
        if(this.collided){
            this.sizeMod = Smooth(this.sizeMod, this.goalSize, 2);

            if(this.sizeMod < 0.1){
                this.removable = true;
            }
        }else{
            this.sizeMod = Smooth(this.sizeMod, this.goalSize, 4);
        }
        

        //this.pos.x += this.velocity.x;
        //this.pos.y += this.velocity.y;

        this.moveTimer -= 1 / frameRate();

        if(this.moveTimer <= 0){
            this.goalVelocity.x = random(-this.moveSpeed, this.moveSpeed);
            this.goalVelocity.y = random(-this.moveSpeed, this.moveSpeed);

            this.moveTimer = 2;
        }

        this.velocity.x = Smooth(this.velocity.x, this.goalVelocity.x, 8);
        this.velocity.y = Smooth(this.velocity.y, this.goalVelocity.y, 8);

        

        this.pos.add(this.velocity);

        if(this.checkEdges()){
            this.removable = true;
        }

    }

    checkEdges(){
        return (this.pos.x > width + objSize * 5
            || this.pos.x <  -objSize * 5
            || this.pos.y > height  + objSize * 5
            || this.pos.y < -objSize * 5);
    }

    
}


