/*
 * A smart barcode scanner for react-native apps
 * https://github.com/react-native-component/react-native-smart-barcode/
 * Released under the MIT license
 * Copyright (c) 2016 react-native-component <moonsunfall@aliyun.com>
 */


import React, {
    Component,
} from 'react'
import {
    View,
    requireNativeComponent,
    NativeModules,
    AppState,
    Platform,
} from 'react-native'
import {ViewPropTypes} from 'deprecated-react-native-prop-types';
import PropTypes from 'prop-types'

const BarcodeManager = Platform.OS == 'ios' ? NativeModules.Barcode : NativeModules.CaptureModule


export default class Barcode extends Component {

    static defaultProps = {
        barCodeTypes: Object.values(BarcodeManager.barCodeTypes),
        scannerRectWidth: 255,
        scannerRectHeight: 255,
        scannerRectTop: 0,
        scannerRectLeft: 0,
        scannerLineInterval: 3000,
        scannerRectCornerColor: `#09BB0D`,
    }

    static propTypes = {
        ...ViewPropTypes,
        onBarCodeRead: PropTypes.func.isRequired,
        barCodeTypes: PropTypes.array,
        scannerRectWidth: PropTypes.number,
        scannerRectHeight: PropTypes.number,
        scannerRectTop: PropTypes.number,
        scannerRectLeft: PropTypes.number,
        scannerLineInterval: PropTypes.number,
        scannerRectCornerColor: PropTypes.string,
    }

    render() {
        return (
            <NativeBarCode
                {...this.props}
            />
        )
    }

    componentDidMount() {
        // AppState.addEventListener('change', this._handleAppStateChange);
    }
    componentWillUnmount() {
        // AppState.removeEventListener('change', this._handleAppStateChange);
    }

    startScan() {
        BarcodeManager.startSession()
    }

    stopScan() {
        BarcodeManager.stopSession()
    }

    startFlash() {
        BarcodeManager.startFlash()
    }

    stopFlash() {
        BarcodeManager.stopFlash()
    }

    _handleAppStateChange = (currentAppState) => {
        if(currentAppState !== 'active' ) {
            this.stopScan()
        }
        else {
            this.startScan()
        }
    }

    decodeFromPath = (path) => {
        return BarcodeManager.decodeFromPath(path);
    }
}

const NativeBarCode = requireNativeComponent(Platform.OS == 'ios' ? 'RCTBarcode' : 'CaptureView', Barcode)
