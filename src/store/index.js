import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		token: uni.getStorageSync('user_token') || null,
		currentUserRoles: uni.getStorageSync('user_roles') || null,
		accountType: uni.getStorageSync('account_type') || null,
        permissionData: uni.getStorageSync('permission_data') || null,
		selectedSupplierIdList: [],
		jointListType: ''
	},
	mutations: {
		signIn(state, { currentUserRoles, accountType, token, permissionData}) { //保存登录信息
			if(currentUserRoles){ //当前所拥有的角色
				uni.setStorageSync('user_roles', currentUserRoles);
				state.currentUserRoles = currentUserRoles;
			}
			if(accountType) { //当前账户类型
				uni.setStorageSync('account_type', accountType);
				state.accountType = accountType;
			}
            if(permissionData) { //权限列表
                uni.setStorageSync('permission_data', permissionData);
                state.permissionData = permissionData;
            }
			state.token = token;
		},
		signOut(state) { //登出清除数据
			uni.removeStorageSync('user_roles');
			uni.removeStorageSync('account_type');
            uni.removeStorageSync('permission_data');
			state.accountType = null;
			state.currentUserRoles = null;
            state.permissionData = null;
		},
		saveSelectedSupplierIds(state, idArr) { //保存已选供应商id的数组
			state.selectedSupplierIdList = idArr;
		},
		saveJointListType(state, type) { //保存首页跳转到列表页的type
			state.jointListType = type;
		}
	},
    getters: {
        permissionList(state) { //平铺权限列表为对象
            const permissionObj = {};
            if(state.permissionData) {
                state.permissionData.forEach((item, index) => {
                    permissionObj[item.tag] = {};
                    permissionObj[item.tag]['tag'] = item.tag;
                    permissionObj[item.tag]['transfers'] = item.transfers;
                    permissionObj[item.tag]['name'] = item.name;
                    permissionObj[item.tag]['id'] = item.id;
                    if(item.child_channels.length > 0) {
                        item.child_channels.forEach((childItem, childIdnex) => {
                        	permissionObj[childItem.tag] = {};
                        	permissionObj[childItem.tag]['tag'] = childItem.tag;
                        	permissionObj[childItem.tag]['transfers'] = childItem.transfers;
                        	permissionObj[childItem.tag]['name'] = childItem.name;
                        	permissionObj[childItem.tag]['id'] = childItem.id;
                        })
                    }
                })
            }
            return permissionObj
        }
    },
	actions: {
		
	}
})

export default store
