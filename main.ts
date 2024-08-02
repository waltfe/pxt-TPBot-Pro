/**
 * The intelligent programming car produced by ELECFREAKS Co.ltd
 */
//% weight=0 color=#32b9b9 icon="\uf1b9"
//% block="TPBot" 
namespace TPBot {
    const tpbotAdd = 0x10
    let initEventUseOne = true
    /**
    * List of driving directions
    */
    export enum DriveDirection {
        //% block="Forward"
        Forward = 0,
        //% block="Backward"
        Backward = 1,
        //% block="Left"
        Left = 2,
        //% block="Right"
        Right = 3
    }
    /**
    * Status List of Tracking Modules
    */
    export enum TrackingState {
        //% block="● ●" enumval=0
        L_R_line,

        //% block="◌ ●" enumval=1
        L_unline_R_line,

        //% block="● ◌" enumval=2
        L_line_R_unline,

        //% block="◌ ◌" enumval=3
        L_R_unline
    }
    /**
    * Unit of Ultrasound Module
    */
    export enum SonarUnit {
        //% block="cm"
        Centimeters,
        //% block="inches"
        Inches
    }
    /**
    * Ultrasonic judgment
    */
    export enum Sonarjudge {
        //% block="<"
        Less,
        //% block=">"
        Greater
    }
    /**
    * Select the servo on the S1 or S2
    */
    export enum ServoList {
        //% block="S1"
        S1 = 1,
        //% block="S2"
        S2 = 2,
        //% block="S3"
        S3 = 3,
        //% block="S4"
        S4 = 4
    }
    /**
    * Line Sensor states  
    */
    export enum LineState {
        //% block="Black" enumval=0
        Black,
        //% block="White"enumval=1
        White
    }
    /**
    * Line Sensor Side
    */
    export enum LineSide {
        //% block="Left" enumval=0
        Left,
        //% block="Right" enumval=1
        Right
    }
    /**
     * Line Sensor events  
     */
    export enum MbEvents {
        //% block="Black"
        Black = DAL.MICROBIT_PIN_EVT_FALL,
        //% block="White"
        White = DAL.MICROBIT_PIN_EVT_RISE
    }
    /**
     * Pins used to generate events
     */
    export enum MbPins {
        //% block="Left"
        Left = DAL.MICROBIT_ID_IO_P13,
        //% block="Right"
        Right = DAL.MICROBIT_ID_IO_P14
    }
    export enum MelodyCMDList {
        //% block="Play"
        Play = 0x03,
        //% block="Stop"
        Stop = 0x16

    }
    export enum MelodyList {
        //% block="Happy"
        Happy = 0x01

    }
    /////////////////////////color/////////////////////////
    export enum ColorList {
        //% block="Red"
        Red,
        //% block="Green"
        Green,
        //% block="Blue"
        Blue,
        //% block="Cyan"
        Cyan,
        //% block="Magenta"
        Magenta,
        //% block="Yellow"
        Yellow,
        //% block="White"
        White
    }

    /**
    * Set the steering gear to 180 or 360
    */
    export enum ServoTypeList {
        //% block="180°"
        S180 = 0,
        //% block="360°"
        S360 = 1
    }


    export enum SpeedUnit {
        //%block="cm/s"
        Cm_s,
        //%block="inch/s"
        Inch_s
    }
    export enum DistanceUnit {
        //%block="cm"
        Cm,
        //%block="inch"
        Inch
    }

    export enum Direction {
        //%block="Forward"
        Forward,
        //%block="Backward"
        Backward
    }

    export enum Wheel {
        //%block="WheelLeft"
        WheelLeft = 0,
        //%block="WheelRight"
        WheelRight = 1,
        //%block="WheelALL"
        WheelALL = 2
    }

    export enum AngleUnits {
        //%block="Angle"
        Angle,
        //%block="Circle"
        Circle
    }

    export enum TurnUnit {
        //%block="Leftsteering"
        Leftsteering = 0,
        //%block="Rightsteering"
        Rightsteering = 1,
        //%block="Stay_Leftsteering"
        Stay_Leftsteering = 2,
        //%block="Stay_Rightsteering"
        Stay_Rightsteering = 3
    }

    export enum TurnAngleUnit {
        //% block="45°"
        T45 = 45,
        //% block="90°"
        T90 = 90,
        //% block="135°"
        T135 = 135,
        //% block="180°"
        T180 = 180
    }

    /******************************************************************************************************
     * 工具函数
     ******************************************************************************************************/
    function i2cCommandSend(command: number, params: number[]) {
        let buff = pins.createBuffer(params.length + 4);
        buff[0] = 0xFF; // 帧头
        buff[1] = 0xF9; // 帧头
        buff[2] = command; // 指令
        buff[3] = params.length; // 参数长度
        for (let i = 0; i < params.length; i++) {
            buff[i + 4] = params[i];
        }
        pins.i2cWriteBuffer(tpbotAdd, buff);
    }

    function initEvents(): void {
        if (initEventUseOne) {
            pins.setEvents(DigitalPin.P13, PinEventType.Edge);
            pins.setEvents(DigitalPin.P14, PinEventType.Edge);
            initEventUseOne = false;
        }
    }



    /******************************************************************************************************
     * 积木块定义
     ******************************************************************************************************/
    //
    /**
     * Set the speed of left and right wheels. 
     * @param lspeed Left wheel speed , eg: 100
     * @param rspeed Right wheel speed, eg: 100
     */
    //% weight=99
    //% group="Basic functions"
    //% block="Set left wheel speed at %lspeed\\%| right wheel speed at %rspeed\\%"
    //% lspeed.min=-100 lspeed.max=100
    //% rspeed.min=-100 rspeed.max=100
    export function motorControl(lspeed: number = 50, rspeed: number = 50): void {

        let direction: number = 0;
        if (lspeed < 0) {
            direction |= 0x01;
        }
        if (rspeed < 0) {
            direction |= 0x2;
        }

        lspeed = Math.min(Math.abs(lspeed), 100);
        rspeed = Math.min(Math.abs(rspeed), 100);
        i2cCommandSend(0x10, [lspeed, rspeed, direction]);

    }

    /**
    * Set the direction, speed, and time of travel.
    * @param direc Setting the direction , eg: DriveDirection.Forward
    * @param speed Setting the speed, eg: 100
    * @param time Setting the time, eg: 1
    */
    //% weight=95
    //% group="Basic functions"
    //% block="Go %direc at speed %speed\\% for %time seconds"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2

    export function setTravelTime(direc: DriveDirection, speed: number, time: number): void {
        if (direc == 0) {
            motorControl(speed, speed)
            basic.pause(time * 1000)
            stopCar()
        }
        if (direc == 1) {
            motorControl(-speed, -speed)
            basic.pause(time * 1000)
            stopCar()
        }
        if (direc == 2) {
            motorControl(-speed, speed)
            basic.pause(time * 1000)
            stopCar()
        }
        if (direc == 3) {
            motorControl(speed, -speed)
            basic.pause(time * 1000)
            stopCar()
        }
    }

    /**
    * Setting the direction and speed of travel.
    * @param direc Setting the direction , eg: DriveDirection.Forward
    * @param speed Setting the speed, eg: 100
    */
    //% weight=90
    //% group="Basic functions"
    //% block="Go %direc at speed %speed\\%"
    //% speed.min=0 speed.max=100
    //% direc.fieldEditor="gridpicker" direc.fieldOptions.columns=2
    export function setTravelSpeed(direc: DriveDirection, speed: number): void {
        if (direc == 0) {
            motorControl(speed, speed)
        }
        if (direc == 1) {
            motorControl(-speed, -speed)
        }
        if (direc == 2) {
            motorControl(-speed, speed)
        }
        if (direc == 3) {
            motorControl(speed, -speed)
        }
    }

    /**
    * Stop the car. 
    */
    //% weight=80
    //% group="Basic functions"
    //% block="Stop the car immediately"
    export function stopCar(): void {
        motorControl(0, 0);
    }

    /**
     * track one side
     * @param side Line sensor edge , eg: LineState.Left
     * @param state Line sensor status, eg: LineSide.FindLine
     */
    //% weight=70
    //% group="Basic functions"
    //% block="%side line sensor detected %state"
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    export function trackSide(side: LineSide, state: LineState): boolean {
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        let left_tracking = pins.digitalReadPin(DigitalPin.P13);
        let right_tracking = pins.digitalReadPin(DigitalPin.P14);
        if (side == 0 && state == 1 && left_tracking == 1) {
            return true;
        }
        else if (side == 0 && state == 0 && left_tracking == 0) {
            return true;
        }
        else if (side == 1 && state == 1 && right_tracking == 1) {
            return true;
        }
        else if (side == 1 && state == 0 && right_tracking == 0) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
    * Judging the Current Status of Tracking Module.
    * @param state Four states of tracking module, eg: TrackingState.L_R_line
    */
    //% weight=60
    //% group="Basic functions"
    //% block="Line sensor state is %state"
    //% state.fieldEditor="gridpicker"
    //% state.fieldOptions.columns=1
    export function trackLine(state: TrackingState): boolean {
        pins.setPull(DigitalPin.P13, PinPullMode.PullNone)
        pins.setPull(DigitalPin.P14, PinPullMode.PullNone)
        let left_tracking = pins.digitalReadPin(DigitalPin.P13);
        let right_tracking = pins.digitalReadPin(DigitalPin.P14);
        if (left_tracking == 0 && right_tracking == 0 && state == 0) {
            return true;
        }
        else if (left_tracking == 1 && right_tracking == 0 && state == 1) {
            return true;
        }
        else if (left_tracking == 0 && right_tracking == 1 && state == 2) {
            return true;
        }
        else if (left_tracking == 1 && right_tracking == 1 && state == 3) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
    * Runs when line sensor finds or loses.
    * @MbPins side Line sensor edge , eg: MbPins.Left
    * @MbEvents state Line sensor status, eg: MbEvents.FindLine
    */
    //% weight=50
    //% group="Basic functions"
    //% block="On %side| line sensor detected %state"
    //% side.fieldEditor="gridpicker" side.fieldOptions.columns=2
    //% state.fieldEditor="gridpicker" state.fieldOptions.columns=2
    export function trackEvent(side: MbPins, state: MbEvents, handler: Action) {
        initEvents();
        control.onEvent(<number>side, <number>state, handler);
        basic.pause(5);
    }
    /**
    * Cars can extend the ultrasonic function to prevent collisions and other functions.
    * @param Sonarunit two states of ultrasonic module, eg: SonarUnit.Centimeters
    */
    //% weight=40
    //% group="Basic functions"
    //% block="Sonar distance unit %unit"
    //% unit.fieldEditor="gridpicker"
    //% unit.fieldOptions.columns=2
    export function sonarReturn(unit: SonarUnit, maxCmDistance = 500): number {
        // send pulse
        pins.setPull(DigitalPin.P16, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P16, 0);
        control.waitMicros(2);
        pins.digitalWritePin(DigitalPin.P16, 1);
        control.waitMicros(10);
        pins.digitalWritePin(DigitalPin.P16, 0);

        // read pulse
        const d = pins.pulseIn(DigitalPin.P15, PulseValue.High, maxCmDistance * 58);
        /*let d = 0
        while (1) {
            control.waitMicros(1)
            if (pins.digitalReadPin(DigitalPin.P15) == 1) {
                d = d + 1
                if (d == 25000)
                    break
            }
            else {
                break
            }
        }*/

        switch (unit) {
            case SonarUnit.Centimeters:
                return Math.idiv(d, 58);
            case SonarUnit.Inches:
                return Math.idiv(d, 148);
            default:
                return d;
        }
    }
    /**
    * sonar Judge.
    * @param dis sonar distance , eg: 5
    * @param judge state, eg: Sonarjudge.<
    */
    //% weight=35
    //% group="Basic functions"
    //% block="Sonar distance %judge %dis cm"
    //% dis.min=5 dis.max=400
    //% judge.fieldEditor="gridpicker" judge.fieldOptions.columns=2
    export function sonarJudge(judge: Sonarjudge, dis: number): boolean {
        if (judge == 0) {
            if (sonarReturn(SonarUnit.Centimeters) < dis && sonarReturn(SonarUnit.Centimeters) != 0) {
                return true
            }
            else {
                return false
            }
        }
        else {
            if (sonarReturn(SonarUnit.Centimeters) > dis) {
                return true
            }
            else {
                return false
            }
        }
    }
    /**
    * Select a color to Set eye mask lamp.
    */
    //% block="Set headlight color to $color"
    //% weight=30
    //% group="Basic functions"
    //% color.shadow="colorNumberPicker"
    export function headlightColor(color: number) {
        let r = color >> 16
        let g = (color >> 8) & 0xFF
        let b = color & 0xFF
        headlightRGB(r, g, b)
    }

    /**
    * Set RGB color of eye mask lamp.
    * @param r R color value of RGB color, eg: 83
    * @param g G color value of RGB color, eg: 202
    * @param b B color value of RGB color, eg: 236
    */
    //% weight=25
    //% group="Basic functions"
    //% inlineInputMode=inline
    //% block="Set headlight color to R:%r G:%g B:%b"
    //% r.min=0 r.max=255
    //% g.min=0 g.max=255
    //% b.min=0 b.max=255
    export function headlightRGB(r: number, g: number, b: number): void {
        i2cCommandSend(0x30, [r, g, b]);
    }
    /**
    * Turn off the eye mask lamp.
    */
    //% block="Turn off the headlights"
    //% group="Basic functions"
    //% weight=20
    export function headlightClose(): void {
        headlightRGB(0, 0, 0)
    }

    /**
    * Set the speed of servo.
    * @param servo ServoList, eg: ServoList.S1
    * @param speed speed of servo, eg: 100
    */
    //% weight=14
    //% group="Basic functions"
    //% block="Set 360° servo %servo speed to %speed \\%"
    //% servo.fieldEditor="gridpicker"
    //% servo.fieldOptions.columns=1
    //% speed.min=-100 speed.max=100
    export function setServo360(servo: ServoList, speed: number = 100): void {
        speed = Math.map(speed, -100, 100, 0, 180);
        i2cCommandSend(0x20, [servo, speed]);
    }

    /**
     * Set the angle of servo. 
     * @param servo ServoList, eg: ServoList.S1
     * @param angle angle of servo, eg: 0
     */
    //% weight=15
    //% group="Basic functions"
    //% block="Set %ServoTypeList servo %servo angle to %angle °"
    export function setServo(servoType: ServoTypeList, servo: ServoList, angle: number = 0): void {
        switch (servoType) {
            case ServoTypeList.S180:
                angle = Math.map(angle, 0, 180, 0, 180)
                break
            case ServoTypeList.S360:
                angle = Math.map(angle, 0, 360, 0, 180)
                break
        }
        i2cCommandSend(0x20, [servo, angle]);
    }



    /***********************************************************************************************
     * PID控制
     ***********************************************************************************************/
    //
    /**
     * control the car to travel at a specific speed (speed.min=20cm/s speed.max=50cm/s)
     * @lspeed set the lspeed
     * @rspeed set the rspeed
     * @unit set the SpeedUnit
     */
    //% group="PID Control"
    //% block="set left wheel speed %lspeed, right wheel speed %rspeed %unit"
    //% weight=210
    export function pidSpeedControl(lspeed: number, rspeed: number, unit: SpeedUnit): void {

        let direction: number = 0;
        if (lspeed < 0) {
            direction |= 0x01;
        }

        if (rspeed < 0) {
            direction |= 0x2;
        }

        switch (unit) {
            case SpeedUnit.Cm_s:
                lspeed *= 10;
                rspeed *= 10;
                break;
            case SpeedUnit.Inch_s:
                lspeed *= 25.4;
                rspeed *= 25.4;
                break;
        }

        if(lspeed != 0){
            lspeed = Math.abs(lspeed);
            lspeed = Math.min(lspeed, 500);
            lspeed = Math.max(lspeed, 200);
        }

        if(rspeed != 0){
            rspeed = Math.abs(rspeed);
            rspeed = Math.min(rspeed, 500);
            rspeed = Math.max(rspeed, 200);
        }

        let lspeed_h = lspeed >> 8;
        let lspeed_l = lspeed & 0xFF;
        let rspeed_h = rspeed >> 8;
        let rspeed_l = rspeed & 0xFF;

        i2cCommandSend(0x40, [lspeed_h, lspeed_l, rspeed_h, rspeed_l, direction]);

    }

    /**
     * set the car to travel a specific distance(distance.max=6000cm, distance.min=0cm)
     * @Direction set the direction eg: Direction.Forward
     * @distance set the distance eg: 0
     * @DistanceUnit set the DistanceUnit eg: DistanceUnit.Cm
     */
    //% group="PID Control"
    //% weight=200
    //% block="go %Direction %distance %DistanceUnit"
    export function pidRunDistance(direction: Direction, distance: number, unit: DistanceUnit): void {

        distance *= (unit == DistanceUnit.Cm ? 10 : 25.4)
        let distance_h = distance >> 8;
        let distance_l = distance & 0xFF;
        let direction_flag = (direction == Direction.Forward ? 0 : 3);
        i2cCommandSend(0x41, [distance_h, distance_l, direction_flag]);
        basic.pause(distance * 2 + 200) // 小车以500mm/s速度运行
    }

    /**
     * Select the wheel and set the Angle or number of turns you want to turn
     * @Wheel Select wheel eg: Wheel.WheelLeft
     * @angle set the angle or number of turns eg: 0
     * @angleUnits set the angle unit eg: AngleUnit.angle
     */
    //% group="PID Control"
    //% weight=200
    //% block="set %Wheel rotation %angle %AngleUnits"
    export function pidRunAngle(wheel: Wheel, angle: number, angleUnits: AngleUnits): void {
        let l_angle_h = 0;
        let l_angle_l = 0;
        let r_angle_h = 0;
        let r_angle_l = 0;
        let direction = 0;
        if (angleUnits == AngleUnits.Circle) angle *= 360;
        if (angle < 0) direction = 3;
        angle *= 2;
        if (wheel == Wheel.WheelLeft || wheel == Wheel.WheelALL) {
            l_angle_l = angle & 0xFF;
            l_angle_h = angle >> 8;
        }
        if (wheel == Wheel.WheelRight || wheel == Wheel.WheelALL) {
            r_angle_l = angle & 0xFF;
            r_angle_h = angle >> 8;
        }

        i2cCommandSend(0x42, [l_angle_h, l_angle_l, r_angle_h, r_angle_l, direction]);
        basic.pause(angle * 2 + 200)
    }

    let blockLength: number = 0;
    let blockUnit: DistanceUnit = DistanceUnit.Cm;

    /**
    * set block length
    * @length set the length of each block eg: 0
    * @DistanceUnit set the DistanceUnit eg: DistanceUnit.Cm
    */
    //% group="PID Control"
    //% weight=180
    //% block="set length of the squares as %length %DistanceUnit"
    export function pidBlockSet(length: number, distanceUnit: DistanceUnit): void {
        blockLength = length
        blockUnit = distanceUnit
    }

    /**
    * run a specific number of block
    * @cnt set the number of block eg: 0
    */
    //% group="PID Control"
    //% weight=170
    //% block="go forward %cnt squares"
    export function pidRunBlock(cnt: number): void {
        pidRunDistance(Direction.Forward, blockLength * cnt, blockUnit)
    }


    /**
     * set the trolley to rotate at a specific Angle
     * @TurnUnit set the rotation mode eg: TurnUnit.Leftsteering
     * @TurnAngleUnit set the angle unit eg: TurnAngleUnit.T45
     */
    //% group="PID Control"
    //% weight=190
    //% block="set car %TurnUnit for angle %TurnAngleUnit"
    export function pidRunSteering(turn: TurnUnit, angle: TurnAngleUnit): void {
        let l_angle_h = 0;
        let l_angle_l = 0;
        let r_angle_h = 0;
        let r_angle_l = 0;
        let direction = 0;

        if (turn == TurnUnit.Leftsteering) {
            angle *= 2;
            r_angle_h = angle >> 8;
            r_angle_l = angle & 0xFF;
        } else if (turn == TurnUnit.Rightsteering) {
            angle *= 2;
            l_angle_h = angle >> 8;
            l_angle_l = angle & 0xFF;
        } else if (turn == TurnUnit.Stay_Leftsteering) {
            r_angle_h = angle >> 8;
            r_angle_l = angle & 0xFF;
            l_angle_h = angle >> 8;
            l_angle_l = angle & 0xFF;
            direction = 1;
        } else if (turn == TurnUnit.Stay_Rightsteering) {
            r_angle_h = angle >> 8;
            r_angle_l = angle & 0xFF;
            l_angle_h = angle >> 8;
            l_angle_l = angle & 0xFF;
            direction = 2;
        }
        i2cCommandSend(0x42, [l_angle_h, l_angle_l, r_angle_h, r_angle_l, direction]);
        basic.pause(angle * 2 + 200)
    }
}
