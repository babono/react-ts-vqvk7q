export enum PLATFORM_TYPE {
  GROUND = 'ground',
  BASIC = 'basic',
  CLOUD = 'fragile',
  MOVING = 'moving',
}

export default class Platform extends Phaser.GameObjects.Container {
  private randomTypePool = [
    PLATFORM_TYPE.BASIC,
    PLATFORM_TYPE.BASIC,
    PLATFORM_TYPE.CLOUD,
    PLATFORM_TYPE.MOVING,
  ];

  private platformSprite: Phaser.GameObjects.Image;

  body: Phaser.Physics.Arcade.Body;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    private platformType = PLATFORM_TYPE.BASIC
  ) {
    super(scene, x, y);

    this.setupComponents();

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.adjustBasedOnType();

    scene.events.on(Phaser.Scenes.Events.UPDATE, this.onUpdate, this);
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.events.off(Phaser.Scenes.Events.UPDATE, this.onUpdate, this);
    });
  }

  private setupComponents() {
    this.platformSprite = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      'platform'
    );

    this.add(this.platformSprite);
  }

  private adjustBasedOnType() {
    const { width: screenWidth } = this.scene.cameras.main;

    const { platformType } = this;
    switch (platformType) {
      case PLATFORM_TYPE.GROUND: {
        this.platformSprite.setTexture('platform');
        this.platformSprite.setDisplaySize(screenWidth * 2, 16);
        this.body.setVelocityX(0);
        break;
      }

      case PLATFORM_TYPE.BASIC: {
        this.platformSprite.setTexture('platform');
        this.platformSprite.setDisplaySize(72, 16);
        this.body.setVelocityX(0);
        break;
      }

      case PLATFORM_TYPE.CLOUD: {
        this.platformSprite.setTexture('cloud_platform');
        this.platformSprite.setDisplaySize(72, 16);
        this.body.setVelocityX(0);
        break;
      }

      case PLATFORM_TYPE.MOVING: {
        this.platformSprite.setTexture('moving_platform');
        this.platformSprite.setDisplaySize(72, 16);
        this.body.setVelocityX(Math.random() > 0.5 ? 100 : -100);
        break;
      }
    }

    this.body.setSize(
      this.platformSprite.displayWidth,
      this.platformSprite.displayHeight
    );
    this.body.setOffset(
      -this.platformSprite.displayWidth * 0.5,
      -this.platformSprite.displayHeight * 0.5
    );
  }

  public randomize() {
    this.platformType =
      this.randomTypePool[
        Math.floor(Math.random() * this.randomTypePool.length)
      ];
    this.adjustBasedOnType();
  }

  public isCloud() {
    return this.platformType === PLATFORM_TYPE.CLOUD;
  }

  public isMoving() {
    return this.platformType === PLATFORM_TYPE.MOVING;
  }

  private handleMovingPlatform() {
    if (this.isMoving()) {
      const { width: screenWidth } = this.scene.cameras.main;

      if (this.x > screenWidth * 0.9 && this.body.velocity.x > 0) {
        this.x = screenWidth * 0.9;
        this.body.velocity.x *= -1;
      } else if (this.x < screenWidth * 0.1 && this.body.velocity.x < 0) {
        this.x = screenWidth * 0.1;
        this.body.velocity.x *= -1;
      }
    }
  }

  private onUpdate() {
    this.handleMovingPlatform();
  }
}
