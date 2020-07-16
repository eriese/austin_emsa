<template>
	<form @submit="approveUsers" v-if="users.length">
		<table>
			<tr>
				<th>Email</th>
				<th>Approved <input type="checkbox" v-model="allSelected"/></th>
			</tr>
			<tr v-for="user in users" :key="user.id">
				<td class="email">{{user.email}}</td>
				<td class="approval"><input type="checkbox" :value="user.id" v-model="approvedUsers"/></td>
			</tr>
		</table>

		<input type="submit">
	</form>
	<div v-else>
		No users awaiting approval
	</div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
	name: 'AdminPanel',
	data() {
		return {
			users: [],
			approvedUsers: [],
			status: ''
		}
	},
	computed: {
		allSelected: {
			get() {
				return this.users.length == this.approvedUsers.length
			},
			set(setVal) {
				if (setVal) {
					this.approvedUsers = this.users.map((u) => u.id);
				} else {
					this.approvedUsers = [];
				}
			}
		}
	},
	methods: {
		approveUsers(e) {
			e.preventDefault();
			this.status = '';
			ApiService.approveUsers(this.approvedUsers).then((response) => {
				if (response.data) {
					this.status = 'Successfully approved users';
					this.loadUsers();
				} else {
					this.status = 'Uh oh! something went wrong';
				}
			})
		},
		loadUsers() {
			ApiService.getAdminData()
			.then((response) => {
				this.users = response.data;
			}).catch((err) => {
				if (err.response.status == 403) {
					this.$router.replace({path: '/shifts'});
				} else {
					console.log(err);
				}
			})
		}
	},
	mounted() {
		this.loadUsers();
	}
}
</script>
