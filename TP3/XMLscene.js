/**
 * XMLscene class, representing the scene that is to be rendered.
 */
class XMLscene extends CGFscene {
    /**
     * @constructor
     * @param {MyInterface} myinterface 
     */
    constructor(myinterface) {
        super();

        this.interface = myinterface;
    }

    /**
     * Initializes the scene, setting some WebGL defaults, initializing the camera and the axis.
     * @param {CGFApplication} application
     */
    init(application) {
        super.init(application);

        this.sceneInited = false;

        this.initCameras();

        this.enableTextures(true);

        this.gl.clearDepth(100.0);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.depthFunc(this.gl.LEQUAL);

        this.axis = new CGFaxis(this);
        this.setUpdatePeriod(100);

        this.loadingProgressObject = new MyRectangle(this, -1, -.1, 1, .1);
        this.loadingProgress = 0;
        this.musicActive = false;
        this.audioIntroGOT = new Audio('scenes/music/music.mp3');
        this.audioIntroGOT.volume = 0.3;

        this.defaultAppearance = new CGFappearance(this);

        this.gameOrchestrator = new MyGameOrchestrator(this);

        
        this.textureIds = {
            'Fire': 0,
            'Default': 1,
        };

        this.numberLoadedThemes = 0;
        this.selectedTheme = 1;
        this.selectedView = 0;

        this.setPickEnabled(true);
    }

    initScene() {
        this.graph = [];
        let theme1 = new MySceneGraph("game.xml", this);
        let theme2 = new MySceneGraph("game2.xml", this);

        
        //this.graph[0].onXMLReady();
    }

    /**
     * Method for activate and deactivate music through interface
     */
    updateMusic() {
        if (this.musicActive) {
            this.audioIntroGOT.loop = true;
            this.audioIntroGOT.play();
        } else {
            this.audioIntroGOT.pause();
            this.audioIntroGOT.currentTime = 0;
        }
    }

    /**
     * Method for updating themes on a change made by the user
     */
    updateSkyBoxTextures() {
        console.log(this.selectedTheme);
        
        this.gameOrchestrator.initGraph(this.graph[this.selectedTheme]);

        this.axis = new CGFaxis(this, this.graph[this.selectedTheme].referenceLength);
        this.gl.clearColor(...this.graph[this.selectedTheme].background);
        this.setGlobalAmbientLight(...this.graph[this.selectedTheme].ambient);
        this.initXMLLights();
        this.initXMLCameras();
        this.setUpdatePeriod(100);
        this.sceneInited = true;
        this.gameOrchestrator.initGraph(this.graph[this.selectedTheme]);

        this.interface.updateCameras();

        console.log(this.graph[this.selectedTheme].viewIDs)
    }

    updateInterfaceCameras() {
        this.camera = this.graph[this.selectedTheme].cameras[this.selectedView];

        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene cameras.
     */
    initCameras() {
        this.camera = new CGFcamera(0.4, 0.1, 500, vec3.fromValues(15, 15, 15), vec3.fromValues(0, 0, 0));

        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene Cameras with the values read from the XML file.
     */
    initXMLCameras() {
        this.camera = this.graph[this.selectedTheme].cameras[this.graph[this.selectedTheme].selectedView];

        this.interface.setActiveCamera(this.camera);
    }

    /**
     * Initializes the scene lights with the values read from the XML file.
     */
    initXMLLights() {
        // Lights index.
        let i = 0;
        
        // Reads the lights from the scene graph.
        for (let key in this.graph[this.selectedTheme].lights) {
            if (i >= 8)
                break;              // Only eight lights allowed by WebCGF on default shaders.

            if (this.graph[this.selectedTheme].lights.hasOwnProperty(key)) {
                var graphLight = this.graph[this.selectedTheme].lights[key];

                this.lights[i].setPosition(...graphLight[1]);
                this.lights[i].setAmbient(...graphLight[2]);
                this.lights[i].setDiffuse(...graphLight[3]);
                this.lights[i].setSpecular(...graphLight[4]);
                this.lights[i].light_id = key;

                this.lights[i].setVisible(true);
                if (graphLight[0])
                    this.lights[i].enable();
                else
                    this.lights[i].disable();

                this.lights[i].update();

                i++;
            }
        }
    }

    /** Handler called when the graph is finally loaded. 
     * As loading is asynchronous, this may be called already after the application has started the run loop
     */
    onGraphLoaded() {

        if(this.numberLoadedThemes == 1) {
            this.axis = new CGFaxis(this, this.graph[this.selectedTheme].referenceLength);
            this.gl.clearColor(...this.graph[this.selectedTheme].background);
            this.setGlobalAmbientLight(...this.graph[this.selectedTheme].ambient);
            this.initXMLLights();
            this.initXMLCameras();
            this.setUpdatePeriod(100);
            this.sceneInited = true;
            this.gameOrchestrator.initGraph(this.graph[this.selectedTheme]);

            // ---- CHANGE THIS ---- //
            this.interface.initInterfaceCameras();
            this.interface.initInterfaceLights();
            this.interface.initMiscellaneous();
            this.interface.initInterfaceThemes();
            this.interface.initGameInterface();
            // ---- CHANGE THIS ---- //

            console.log(this.textureIds);
            console.log(this.graph[this.selectedTheme].viewIDs)
        }
        else {
            this.numberLoadedThemes++;
        }
    }
    /**
     * Method called periodically (as per setUpdatePeriod() in init())
     * @param {integer} t 
     */
    update(t) {
        let elapsedTime;

        if(this.time == null) 
            elapsedTime = 0;
        else 
            elapsedTime = t - this.time;

        this.time = t;

        for (let k in this.graph[this.selectedTheme].keyframesAnimation)
            this.graph[this.selectedTheme].keyframesAnimation[k].update(elapsedTime / 1000);

        for (let k in this.graph[this.selectedTheme].spritesAnim)
            this.graph[this.selectedTheme].spritesAnim[k].update(elapsedTime / 1000);

        this.gameOrchestrator.update(t);
    }

    /**
     * Displays the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup

        // Clear image and depth buffer everytime we update the scene
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();

        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

        this.pushMatrix();

        for (var i = 0; i < this.lights.length; i++) {
            this.lights[i].update();
            if (this.lights[i].light_id != undefined)
                this.lights[i].setVisible(true);
        }

        if (this.sceneInited) {
            // Draw axis
            this.axis.display();
 
            this.defaultAppearance.apply();
            
            // Displays the scene (MySceneGraph function).
            this.gameOrchestrator.display();
        }
        else {
            // Show some "loading" visuals
            this.defaultAppearance.apply();

            this.rotate(-this.loadingProgress/10.0,0,0,1);
            
            this.loadingProgressObject.display();
            this.loadingProgress++;
        }

        this.popMatrix();
        // ---- END Background, camera and axis setup
    }
}