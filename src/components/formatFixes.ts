import { ios } from "tns-core-modules/application";
import {EntityProperty} from "nativescript-ui-dataform";
export const preferredDateFormat: string = "MM/dd/yyyy";
interface FixFunctions {
	DatePicker: Function
	[key: string]: Function
}
class Fixer {
	fixFunctions: FixFunctions;

	constructor(fixFunctions: FixFunctions) {
		this.fixFunctions = fixFunctions
	}
	fixEditor(editorType: string, editor: any) {
		console.log ('fixing editor: ', editor);
		this.fixFunctions[editorType] && this.fixFunctions[editorType](editor);
	}
}

declare var NSDateFormatter:any;
declare var java:any;
const iosFixer = new Fixer({
	DatePicker(editor: any) {
		const dateFormatter = NSDateFormatter.alloc().init();
		dateFormatter.dateFormat = preferredDateFormat;
		editor.dateFormatter = dateFormatter;
	}
})

const androidFixer = new Fixer({
	DatePicker(editor: any) {
		const simpleDateFormat = new java.text.SimpleDateFormat(preferredDateFormat, java.util.Locale.US);
		editor.setDateFormat(simpleDateFormat);
	}
})

export default function formatFixes(args: any) {
	const entityProperty: EntityProperty = args.object.getPropertyByName(args.propertyName);

	if (entityProperty.editor === undefined) {
		return;
	}

	const editorType = entityProperty.editor.type;
	const fixer: Fixer = ios ? iosFixer : androidFixer;
	fixer.fixEditor(editorType, args.editor);
}

// editorSetupSliderAndroid(editor) {
// 		const coreEditor = <android.widget.SeekBar>editor.getEditorView();
// 		coreEditor.getThumb().setColorFilter(new android.graphics.PorterDuffColorFilter(colorDark.android, android.graphics.PorterDuff.Mode.SRC_IN));
// 		coreEditor.getProgressDrawable().setColorFilter(new android.graphics.PorterDuffColorFilter(colorLight.android, android.graphics.PorterDuff.Mode.SRC_IN));
// }

// editorSetupSliderIOS(editor) {
//     const coreEditor = <UISlider>editor.editor;
//     coreEditor.tintColor = colorLight.ios;
//     coreEditor.thumbTintColor = colorDark.ios;
// }
