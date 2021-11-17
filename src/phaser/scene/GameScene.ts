import Collectible from '../object/Collectible';
import Header from '../object/Header';
import Platform, { PLATFORM_TYPE } from '../object/Platform';
import Player from '../object/Player';

export default class GameScene extends Phaser.Scene {
  private platforms: Platform[];

  private player: Player;

  private collectibles: Collectible[];

  private score = 0;

  constructor() {
    super({
      key: 'GameScene',
    });
  }

  preload() {
    const imageList = [
      'garuda',
      'atom',
      'platform',
      'star',
      'trampoline',
      'cloud_platform',
      'moving_platform',
      'trophy',
    ];
    imageList.forEach((image) => {
      this.load.image(
        image,
        `https://cdn.jsdelivr.net/gh/Miscavel/Garuda-Jump@master/public/assets/${image}.png`
      );
    });
  }

  create() {
    this.spawnCollectibles();
    this.spawnBlocks();
    this.spawnPlayer();

    const header = new Header(this, this.cameras.main.width * 0.5, 24);

    this.physics.add.overlap(
      this.platforms,
      this.player,
      (platform: Platform, playerBody) => {
        const playerJumped = this.player.jump();
        if (playerJumped && platform.isCloud()) {
          this.recyclePlatform(platform);
        }
      }
    );

    this.score = 0;
    this.physics.add.overlap(
      this.collectibles,
      this.player,
      (collectible: Collectible) => {
        if (collectible.isStar()) {
          const playerSuperJumped = this.player.superJump();
          if (playerSuperJumped) {
            collectible.setPosition(-9999, -9999);
          }
        } else if (collectible.isAtom()) {
          this.score += 1;
          header.setScore(this.score);
          header.setHighScore(this.score);
          collectible.setPosition(-9999, -9999);
        }
      }
    );

    this.setupControls();
  }

  private setupControls() {
    this.input.keyboard.off(
      Phaser.Input.Keyboard.Events.ANY_KEY_DOWN,
      this.onKeyDown,
      this
    );
    this.input.keyboard.on(
      Phaser.Input.Keyboard.Events.ANY_KEY_DOWN,
      this.onKeyDown,
      this
    );

    this.input.keyboard.off(
      Phaser.Input.Keyboard.Events.ANY_KEY_UP,
      this.onKeyUp,
      this
    );
    this.input.keyboard.on(
      Phaser.Input.Keyboard.Events.ANY_KEY_UP,
      this.onKeyUp,
      this
    );
  }

  private onKeyDown(event: KeyboardEvent) {
    const { code } = event;
    switch (code) {
      case 'ArrowLeft': {
        this.player.tiltLeft();
        break;
      }

      case 'ArrowRight': {
        this.player.tiltRight();
        break;
      }
    }
  }

  private onKeyUp(event: KeyboardEvent) {
    const { code } = event;
    switch (code) {
      case 'ArrowLeft': {
        this.player.resetAccelerationX();
        break;
      }

      case 'ArrowRight': {
        this.player.resetAccelerationX();
        break;
      }
    }
  }

  private spawnPlayer() {
    const { width: screenWidth, height: screenHeight } = this.cameras.main;
    const centerOfScreenX = screenWidth * 0.5;
    const bottomOfScreenY = screenHeight;

    this.player = new Player(this, centerOfScreenX, bottomOfScreenY - 40);
  }

  private spawnBlocks() {
    const { width: screenWidth, height: screenHeight } = this.cameras.main;
    const centerOfScreenX = screenWidth * 0.5;
    const bottomOfScreenY = screenHeight;

    this.platforms = new Array<Platform>();

    for (let i = 0; i < 10; i++) {
      if (i === 0) {
        const basePlatform = new Platform(
          this,
          centerOfScreenX,
          bottomOfScreenY,
          PLATFORM_TYPE.GROUND
        );
        this.platforms.push(basePlatform);
      } else {
        const platform = new Platform(
          this,
          Phaser.Math.RND.between(36, screenWidth - 36),
          bottomOfScreenY - 75 * i
        );
        this.randomizePlatform(platform);
        this.platforms.push(platform);
      }
    }
  }

  private randomizePlatform(platform: Platform) {
    platform.randomize();
    if (Math.random() > 0.8) {
      const collectible = this.collectibles.shift();
      collectible.randomize();
      if (collectible.isAtom()) {
        collectible.parentContainer?.remove(collectible);
        this.add.existing(collectible);
        collectible.setPosition(
          Phaser.Math.RND.between(platform.x - 32, platform.x + 32),
          Phaser.Math.RND.between(platform.y - 16, platform.y - 56)
        );
      } else {
        collectible.parentContainer?.remove(collectible);
        platform.add(collectible);
        collectible.setPosition(0, -10);
      }

      this.collectibles.push(collectible);
    }
  }

  private spawnCollectibles() {
    this.collectibles = new Array<Collectible>();

    for (let i = 0; i < 10; i++) {
      const collectible = new Collectible(this, -9999, -9999);
      this.collectibles.push(collectible);
    }
  }

  private updateCameraCenter() {
    this.cameras.main.centerOn(
      this.cameras.main.midPoint.x,
      Math.min(this.cameras.main.midPoint.y, this.player.y)
    );
  }

  public keepPlayerWithinScreen() {
    const { width: screenWidth } = this.cameras.main;
    if (this.player.x < -100) {
      this.player.x = screenWidth + 100;
    } else if (this.player.x > screenWidth + 100) {
      this.player.x = -100;
    }
  }

  private isTransformOutOfScreen(
    transform: Phaser.GameObjects.Components.Transform
  ) {
    const { height: screenHeight, midPoint } = this.cameras.main;

    return transform.y > midPoint.y + screenHeight * 0.55;
  }

  private recyclePlatform(platform: Platform) {
    const { width: screenWidth } = this.cameras.main;

    const index = this.platforms.indexOf(platform);
    const highestPlatform = this.platforms[this.platforms.length - 1];

    platform.setPosition(
      Phaser.Math.RND.between(36, screenWidth - 36),
      highestPlatform.y - 75
    );
    this.randomizePlatform(platform);
    this.platforms.push(...this.platforms.splice(index, 1));
  }

  public recycleLowestPlatform() {
    const lowestPlatform = this.platforms[0];

    if (this.isTransformOutOfScreen(lowestPlatform)) {
      this.recyclePlatform(lowestPlatform);
    }
  }

  private checkGameOver() {
    if (this.isTransformOutOfScreen(this.player)) {
      this.scene.start('GameScene');
    }
  }

  update() {
    this.updateCameraCenter();
    this.keepPlayerWithinScreen();
    this.recycleLowestPlatform();
    this.checkGameOver();
  }
}
