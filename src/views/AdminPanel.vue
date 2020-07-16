<template>
	<form @submit="approveUsers" v-if="users.length" class="users-form side-padded">
		<back-button :to="{name: 'ShiftList'}" />
		<h1 class="h1">Users Awaiting Approval</h1>
		<table class="users-table" >
			<tr>
				<th>Email</th>
				<th>Approved <input type="checkbox" v-model="allSelected"/></th>
			</tr>
			<tr v-for="user in users" :key="user.id" class="user">
				<td class="user__email">{{user.email}}</td>
				<td class="user__approval"><input type="checkbox" :value="user.id" v-model="approvedUsers"/></td>
			</tr>
		</table>

		<input type="submit" class="button">
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
				if (err.response.status == 401) {
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

<style scoped lang="scss">
.users-form {
	text-align: center;
}

.users-table {
	text-align: left;
	table-layout: auto;
	min-width: 300px;
	margin: 2rem auto;

	th {
		font-size: 1.25rem;
		padding-right: 1rem;
	}
}

.user {
	border-bottom: 2px solid;
	border-color: var(--emsa-blue);

	td {
		padding: 0.5rem 1rem 0.1rem 0.5rem;
	}

	&__approval {
		text-align: right;
	}
}
</style>
