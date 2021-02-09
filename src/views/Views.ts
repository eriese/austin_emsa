import ShiftForm from './ShiftForm.vue';
import ShiftList from './ShiftList.vue';
import ShiftView from './ShiftView.vue';
import Login from './Login.vue';
import UserView from './UserView.vue';
import ForgotPassword from './ForgotPassword.vue';
import Spreadsheet from './Spreadsheet.vue';

export default {
	ShiftForm,
	ShiftList,
	ShiftView,
	Login,
	UserView,
	ForgotPassword,
	StationCodes: {...Spreadsheet, name: 'StationCodes'}
}
