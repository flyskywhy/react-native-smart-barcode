# react-native-smart-barcode

[![npm version](http://img.shields.io/npm/v/@flyskywhy/react-native-smart-barcode.svg?style=flat-square)](https://npmjs.org/package/@flyskywhy/react-native-smart-barcode "View this project on npm")
[![npm downloads](http://img.shields.io/npm/dm/@flyskywhy/react-native-smart-barcode.svg?style=flat-square)](https://npmjs.org/package/@flyskywhy/react-native-smart-barcode "View this project on npm")
[![npm licence](http://img.shields.io/npm/dt/@flyskywhy/react-native-smart-barcode.svg?style=flat-square)](https://npmjs.org/package/@flyskywhy/react-native-smart-barcode "View this project on npm")
[![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-989898.svg?style=flat-square)](https://npmjs.org/package/@flyskywhy/react-native-smart-barcode "View this project on npm")

A smart barcode scanner component for React Native app.
The library uses [https://github.com/zxing/zxing][1] to decode the barcodes for android, and also supports ios.

## Preview

![react-native-smart-barcode-preview-ios][2]

## Installation

For RN >= 0.60
```
npm install @flyskywhy/react-native-smart-barcode --save
cd ios
pod install
```

For RN < 0.60
```
npm install @flyskywhy/react-native-smart-barcode@1.1.x --save
react-native link @flyskywhy/react-native-smart-barcode
```

## Notice

It can only be used greater-than-equal react-native 0.4.0 for ios, if you want to use the package less-than react-native 0.4.0, use `npm install react-native-smart-barcode@untilRN0.40 --save`


## Installation (iOS)
For RN < 0.60, need files edited below:

* Drag RCTBarCode.xcodeproj to your project on Xcode.

* Click on your main project file (the one that represents the .xcodeproj) select Build Phases and drag libRCTBarCode.a from the Products folder inside the RCTBarCode.xcodeproj.

* Look for Header Search Paths and make sure it contains $(SRCROOT)/../../../react-native/React as recursive.

* Dray raw folder to your project

* Add `Privacy - Camera Usage Description` property in your info.plist(for ios 10)

## Installation (Android)
If got
```
> A failure occurred while executing com.android.build.gradle.tasks.VerifyLibraryResourcesTask$Action
   > Android resource linking failed
     ERROR: node_modules/@flyskywhy/react-native-smart-barcode/android/build/intermediates/merged_res/release/values-v26/values-v26.xml:7: AAPT: error: resource android:attr/colorError not found.
```
you may need add below into `YOUR_APP/android/build.gradle`:
```
subprojects {
    afterEvaluate {
        project ->
            if (project.hasProperty("android")) {
                android {
                    compileSdkVersion = rootProject.compileSdkVersion
                    buildToolsVersion = rootProject.buildToolsVersion
                }
            }
    }
}
```

For RN < 0.60, need files edited below:

* In `android/settings.gradle`

```
...
include ':react-native-smart-barcode'
project(':react-native-smart-barcode').projectDir = new File(rootProject.projectDir, '../node_modules/@flyskywhy/react-native-smart-barcode/android')
```

* In `android/app/build.gradle`

```
...
dependencies {
    ...
    // From node_modules
    implementation project(':react-native-smart-barcode')
}
```

* In MainApplication.java

```
...
private ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    //  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
              new MainReactPackage()
      );
    }
  };

  public void setReactNativeHost(ReactNativeHost reactNativeHost) {
    mReactNativeHost = reactNativeHost;
  }

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }
...
```

* In MainActivity.java
```
...
import com.reactnativecomponent.barcode.RCTCapturePackage;    //import RCTCapturePackage
...
@Override
protected void onCreate(Bundle savedInstanceState) {
    MainApplication application = (MainApplication) this.getApplication();
    application.setReactNativeHost(new ReactNativeHost(application) {
        @Override
        protected boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RCTCapturePackage(MainActivity.this)    //register Module
            );
        }

    });

    super.onCreate(savedInstanceState);
}
```

* In AndroidManifest.xml, add camera permissions
```
...
<uses-permission android:name="android.permission.CAMERA"/>
<uses-permission android:name="android.permission.VIBRATE"/>

<uses-feature android:name="android.hardware.camera"/>
<uses-feature android:name="android.hardware.camera.autofocus"/>
...
```


## Full Demo

see [ReactNativeComponentDemos][0]

## Usage

Install the package from npm with `npm install @flyskywhy/react-native-smart-barcode --save`.
Then, require it from your app's JavaScript files with `import Barcode from '@flyskywhy/react-native-smart-barcode'`.

```js


import React, {
    Component,
} from 'react'
import {
    View,
    StyleSheet,
    Alert,
} from 'react-native'

import Barcode from '@flyskywhy/react-native-smart-barcode'
import TimerEnhance from 'react-native-smart-timer-enhance'

class BarcodeTest extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            viewAppear: false,
        };
    }

    render() {

        return (
            <View style={{flex: 1, backgroundColor: 'black',}}>
                {this.state.viewAppear ? <Barcode style={{flex: 1, }}
                                                  ref={ component => this._barCode = component }
                                                  onBarCodeRead={this._onBarCodeRead}/> : null}
            </View>
        )
    }

    componentDidMount() {
        let viewAppearCallBack = (event) => {
            this.setTimeout( () => {
                this.setState({
                    viewAppear: true,
                })
            }, 255)

        }
        this._listeners = [
            this.props.navigator.navigationContext.addListener('didfocus', viewAppearCallBack)
        ]

    }

    componentWillUnmount () {
        this._listeners && this._listeners.forEach(listener => listener.remove());
    }

    _onBarCodeRead = (e) => {
        console.log(`e.nativeEvent.data.type = ${e.nativeEvent.data.type}, e.nativeEvent.data.code = ${e.nativeEvent.data.code}`)
        this._stopScan()
        Alert.alert(e.nativeEvent.data.type, e.nativeEvent.data.code, [
            {text: 'OK', onPress: () => this._startScan()},
        ])
    }

    _startScan = (e) => {
        this._barCode.startScan()
    }

    _stopScan = (e) => {
        this._barCode.stopScan()
    }

}

export default TimerEnhance(BarcodeTest)
```

## Props

Prop                   | Type   | Optional | Default   | Description
---------------------- | ------ | -------- | --------- | -----------
barCodeTypes           | array  | Yes      |           | determines the supported barcodeTypes
scannerRectWidth       | number | Yes      | 255       | determines the width of scannerRect
scannerRectHeight      | number | Yes      | 255       | determines the height of scannerRect
scannerRectTop         | number | Yes      | 0         | determines the top shift of scannerRect
scannerRectLeft        | number | Yes      | 0         | determines the left shift of scannerRect
scannerLineInterval    | number | Yes      | 3000      | determines the interval of scannerLine's movement
scannerRectCornerColor | string | Yes      | `#09BB0D` | determines the color of scannerRectCorner

[0]: https://github.com/cyqresig/ReactNativeComponentDemos
[1]: https://github.com/zxing/zxing
[2]: http://cyqresig.github.io/img/react-native-smart-barcode-preview-ios-v1.0.0.gif
[3]: http://cyqresig.github.io/img/react-native-smart-barcode-preview-android-v1.0.0.gif