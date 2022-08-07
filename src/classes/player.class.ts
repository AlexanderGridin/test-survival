import { InputKey } from "../enumerations/input-key.enum";
import { GameObject } from "./game-object.class";
import { SharedGameData } from "./shared-game-data.class";

interface CollisionData {
  xCollision: boolean;
  yCollision: boolean;
}

export class Player extends GameObject {
  public readonly width = 64;
  public readonly height = 64;

  public speed = 3;

  public posX!: number;
  public posY!: number;

  public directionX = 1;
  public directionY = 1;

  private angle = 0;
  private rotationSpeed = 1;
  private rotationDirection = 1;

  private isShowHelpers = false;

  constructor(posX: number, posY: number) {
    super();

    this.posX = posX;
    this.posY = posY;
  }

  public update(gameData: SharedGameData): void {
    const { xCollision, yCollision } = this.checkWorldCollision(
      gameData.geometry
    );

    if (gameData.inputHandler.isKeyPressed(InputKey.X)) {
      this.isShowHelpers = true;
    }

    if (gameData.inputHandler.isKeyPressed(InputKey.C)) {
      this.isShowHelpers = false;
    }

    if (gameData.inputHandler.isKeyPressed(InputKey.K)) {
      if (this.angle > 360 || this.angle < -360) {
        this.angle = 0;
      } else {
        this.angle += this.rotationSpeed * this.rotationDirection;
      }
    }

    if (gameData.inputHandler.isKeyPressed(InputKey.J)) {
      if (this.angle > 360 || this.angle < -360) {
        this.angle = 0;
      } else {
        this.angle += this.rotationSpeed * -this.rotationDirection;
      }
    }

    if (gameData.inputHandler.isKeyPressed(InputKey.L)) {
      this.angle = 0;
    }

    if (xCollision) {
      if (this.posX < this.width * 0.5) {
        this.posX = this.width * 0.5;
        return;
      }
      // this.posX + this.width * 0.5 > gameData.geometry.width
      this.posX = gameData.geometry.width - this.width * 0.5;
      return;
    }

    if (yCollision) {
      this.directionY *= -1;
    }

    if (gameData.inputHandler.isKeyPressed(InputKey.W)) {
      this.posY -= this.speed * this.directionY;
      return;
    }

    if (gameData.inputHandler.isKeyPressed(InputKey.S)) {
      this.posY += this.speed * this.directionY;
      return;
    }

    if (gameData.inputHandler.isKeyPressed(InputKey.D)) {
      this.posX += this.speed * this.directionX;
      return;
    }

    if (gameData.inputHandler.isKeyPressed(InputKey.A)) {
      this.posX -= this.speed * this.directionX;
      return;
    }
  }

  public draw(context: CanvasRenderingContext2D): void {
    // Stack Overflow link about rotation
    // https://stackoverflow.com/questions/17125632/html5-canvas-rotate-object-without-moving-coordinates

    context.save();

    context.fillStyle = "#A3BE8C";

    // Note that the context is now in its rotated state.
    // That means drawing position [0,0] is visually at [ posX + this.width * 0.5, posY + this.height * 0.5 ].
    context.translate(this.posX, this.posY);

    // The (this.angle * Math.PI) / 180 is trasformation of angle value in degrees to radians
    context.rotate((this.angle * Math.PI) / 180);

    // you must draw the rotated rect at [ this.width * -0.5, this.height * -0.5 ] (not at the original unrotated x/y).
    context.fillRect(
      this.width * -0.5,
      this.height * -0.5,
      this.width,
      this.height
    );

    if (this.isShowHelpers) {
      this.drawHelpers({
        context,
      });
    }

    context.restore();
  }

  private drawHelpers({
    context,
    isShowCorners,
  }: {
    context: CanvasRenderingContext2D;
    isShowCorners?: boolean;
  }): void {
    const width = 10;
    const height = 10;

    context.fillStyle = "#BF616A";

    // center
    context.fillRect(-5, -5, 10, 10);

    if (isShowCorners) {
      //top right
      context.fillRect(
        this.width * 0.5 - width,
        this.height * -0.5,
        width,
        height
      );

      //bottom right
      context.fillRect(
        this.width * 0.5 - width,
        this.height * 0.5 - height,
        width,
        height
      );

      //bottom left
      context.fillRect(
        this.width * -0.5,
        this.height * 0.5 - height,
        width,
        height
      );

      //top left
      context.fillRect(this.width * -0.5, this.height * -0.5, width, height);
    }

    // direction line
    context.strokeStyle = "#BF616A";
    context.beginPath();
    context.moveTo(0, this.height * -0.5);
    context.lineTo(0, 0);
    context.stroke();

    // position text
    context.font = "16px Arial";
    context.fillText(
      `x: ${this.posX.toFixed(0)}`,
      this.width * -0.5,
      this.height * -0.5 - 30
    );
    context.fillText(
      `y: ${this.posY.toFixed(0)}`,
      this.width * -0.5,
      this.height * -0.5 - 10
    );
  }

  private checkWorldCollision(gameGeometry: {
    width: number;
    height: number;
  }): CollisionData {
    return {
      xCollision:
        this.posX < this.width * 0.5 ||
        this.posX + this.width * 0.5 > gameGeometry.width,
      yCollision:
        this.posY < this.height * 0.5 ||
        this.posY + this.height * 0.5 > gameGeometry.height,
    };
  }
}
