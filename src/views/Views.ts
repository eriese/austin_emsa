import ShiftForm from './ShiftForm.vue';
import ShiftList from './ShiftList.vue';
import ShiftView from './ShiftView.vue';
import Login from './Login.vue';
import UserView from './UserView.vue';
import ForgotPassword from './ForgotPassword.vue';
import Spreadsheet from './Spreadsheet.vue';
import Interstitial from './Interstitial.vue';

export default {
	ShiftForm,
	ShiftList,
	ShiftView,
	Login,
	UserView,
	ForgotPassword,
	ConfirmEmail: {...ForgotPassword, name: 'ConfirmEmail'},
	StationCodes: {...Spreadsheet, name: 'StationCodes'},
	Interstitial,
}
