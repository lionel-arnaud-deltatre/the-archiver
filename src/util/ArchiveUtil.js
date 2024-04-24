class ArchiveUtil {
	static getArchiveName (appName, deviceType, environment, version) {
		return `${appName}_${deviceType}_${environment}_${version}.zip`
	}
}

module.exports = ArchiveUtil
