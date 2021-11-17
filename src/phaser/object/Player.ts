export default class Player extends Phaser.GameObjects.Container {
  private bodySprite: Phaser.GameObjects.Sprite;

  body: Phaser.Physics.Arcade.Body;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    this.setupComponents();
    this.setupBody();

    scene.add.existing(this);
  }

  private setupComponents() {
    this.bodySprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'garuda')
      .setDisplaySize(80, 80)
      .setOrigin(0.5, 1)
      .setPosition(0, 40);

    this.add(this.bodySprite);
  }

  private setupBody() {
    this.scene.physics.add.existing(this);

    this.body.setSize(50, 10);
    this.body.setOffset(-25, 30);

    this.body.setGravityY(1000);
    this.body.setDragX(250);

    this.body.setMaxVelocityX(1000);
  }

  private squishSprite() {
    this.scene.tweens.add({
      duration: 125,
      targets: this.bodySprite,
      scaleX: 0.9 * this.bodySprite.scaleX,
      scaleY: 0.9 * this.bodySprite.scaleY,
      yoyo: true,
    });
  }

  public jump() {
    if (this.body.velocity.y >= 0) {
      this.squishSprite();
      this.body.setVelocityY(-600);
      return true;
    }
    return false;
  }

  public superJump() {
    if (this.body.velocity.y >= 0) {
      this.body.setVelocityY(-1200);
      return true;
    }
    return false;
  }

  public tiltLeft() {
    this.bodySprite.flipX = true;
    this.setAccelerationX(-1000);
  }

  public tiltRight() {
    this.bodySprite.flipX = false;
    this.setAccelerationX(1000);
  }

  public setAccelerationX(accelX: number) {
    this.body.setAccelerationX(accelX);
  }

  public resetAccelerationX() {
    this.body.setAccelerationX(0);
  }
}
