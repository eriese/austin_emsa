<template>
	<form @submit="submitUsers" v-if="users.length" class="users-form side-padded">
		<back-button :to="{name: 'ShiftList'}" />
		<h1 class="h1">{{title}}</h1>
		<table class="users-table">
			<tr>
				<th>
					<button type="button" class="table-sort fas" @click="sortBy('email')">
						<span class="table-sort__icon fas" :class="[sortField == 'email' ? `fa-chevron-${sortDirection}` : 'fa-minus']"></span>
						Email
					</button>
				</th>
				<th class="users-table__input">
					<button type="button" class="table-sort" @click="sortBy(propName)">
						<span class="table-sort__icon fas" :class="[sortField == propName ? `fa-chevron-${sortDirection}` : 'fa-minus']"></span>
						{{columnName}}
						<input type="checkbox" v-model="allSelected"/>
					</button>
				</th>
			</tr>
			<tr v-for="user in sortedUsers" :key="user.id" class="users-table__user">
				<td class="user__email">{{user.email}}</td>
				<td class="users-table__input"><input type="checkbox" :value="user.id" v-model="selectedUsers"/></td>
			</tr>
		</table>

		<input type="submit" class="button">
		<div class="users-form__form-status" :class="statusClass">{{status}}</div>
	</form>
	<div v-else>
		No users {{title.toLowerCase()}}
	</div>
</template>

<script>
import ApiService from '../services/ApiService';

export default {
	name: 'AdminPanel',
	data() {
		return {
			users: [],
			selectedUsers: [],
			status: '',
			title: '',
			confirmationText: '',
			columnName: '',
			allUsers: undefined,
			sortField: undefined,
			sortDirection: 'down',
			statusClass: ''
		}
	},
	props: {
		propName: String
	},
	watch: {
		propName(newValue) {
			this.onPropChange(newValue);
		}
	},
	computed: {
		allSelected: {
			get() {
				return this.users.length == this.selectedUsers.length
			},
			set(setVal) {
				if (setVal) {
					this.selectedUsers = this.users.map((u) => u.id);
				} else {
					this.selectedUsers = [];
				}
			}
		},
		sortedUsers() {
			return this.users.slice().sort((u1, u2) => {
				let comp = 0;
				const u1f = u1[this.sortField];
				const u2f = u2[this.sortField];
				if (typeof u1f == 'boolean') {
					if (u1f && !u2f) { comp = -1; }
					if (u2f && !u1f) { comp = 1; }
				}

				else if (typeof u1f == 'string') {
					comp = u1f.localeCompare(u2f);
				}

				if (this.sortDirection == 'up') {
					comp = -1 * comp;
				}

				return comp;
			})
		}
	},
	methods: {
		submitUsers(e) {
			e.preventDefault && e.preventDefault();
			this.status = '';
			this.statusClass = '';

			if (this.selectedUsers.length === 0) {
				switch (this.propName) {
					case 'approved':
						this.status = "Opps, you didn't select anyone to approve!"
						break;
					case 'admin':
						this.status = "You must have at least one admin user."
				}

				this.statusClass = 'form__error'
				return;
			}

			ApiService.adminPost(this.propName, this.selectedUsers).then((response) => {
				if (response.data) {
					this.status = `Successfully ${this.confirmationText}`;
					this.loadUsers();
				} else {
					this.statusClass = 'form__error'
					this.status = 'Uh oh! something went wrong';
				}
			})
		},
		loadUsers() {
			ApiService.getAdminData(this.allUsers)
			.then((response) => {
				this.users = response.data;
				this.selectedUsers = [];
				this.users.forEach((u) => {
					if (u[this.propName]) {
						this.selectedUsers.push(u.id);
					}
				})
			}).catch((err) => {
				if (err.response.status == 401) {
					this.$router.replace({path: '/shifts'});
				} else {
					console.log(err);
				}
			})
		},
		sortBy(field) {
			if (field == this.sortField) {
				this.sortDirection = this.sortDirection == 'down' ? 'up' : 'down';
			} else {
				this.sortField = field;
				this.sortDirection = 'down';
			}
		},
		onPropChange(newValue) {
			switch(newValue) {
				case 'approved':
					this.title = 'Users Awaiting Approval';
					this.confirmationText = 'approved users';
					this.columnName = 'Approved';
					this.allUsers = undefined;
					break;
				case 'admin':
					this.title = "Manage Admin Users";
					this.confirmationText = 'set admin users';
					this.columnName = 'Admin';
					this.allUsers = true;
			}

			this.status = '';
			this.sortField = newValue;
			this.loadUsers();
		}
	},
	mounted() {
		this.onPropChange(this.propName);
	}
}
</script>

<style scope lang="scss">
.users-form {
	text-align: center;

	&__form-status {
		margin-top: 1rem;
	}
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

	&__user {
		border-bottom: 2px solid;
		border-color: var(--emsa-blue);

		td {
			padding: 0.5rem 1rem 0.1rem 0.5rem;
		}

	}

	&__input {
		text-align: right;
	}
}

.table-sort {
	padding: 0;

	&__icon:before {
		font-size: 1rem;
	}
}
</style>
