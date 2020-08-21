require 'json'

package = JSON.parse(File.read(File.join(__dir__, 'package.json')))

Pod::Spec.new do |s|
  s.name         = 'react-native-smart-barcode'
  s.version      = package['version']
  s.summary      = package['description']
  s.license      = package['license']

  s.authors      = package['author']
  s.homepage     = package['homepage']
  s.platform     = :ios, "9.0"

  s.source       = { :git => "https://github.com/flyskywhy/react-native-smart-barcode.git", :tag => "v#{s.version}" }
  s.source_files  = "ios/**/*.{h,m}"
  s.exclude_files = "ios/RCTBarcode/RCTBarcode/ScannerRect.{h,m}"

  s.dependency 'React'
end
