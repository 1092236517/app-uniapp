/**
 * 手机号，ip等验证
 * @author CodeAnti
 * @email codeanti@zhuniu.com
 */
const validater = {

  /**
   * 校验 包括中文字、英文字母、数字和下划线
   * 登录账号校验
   */
  validateAccount(value, callback) {
    let acount = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/
    if (value && (!(acount).test(value))) {
      callback(false, '账号不符合规范')
    } else {
      callback(true)
    }
  },
 
  /**
   * IP地址校验
   */
  ipAddress(value, callback) {
	if(value && "..." === value){
		callback(false, '请输入IP地址')
	}if (value && !(/((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/).test(value)) {
      callback(false, 'IP地址不符合规范')
    } else {
      callback(true)
    }
  },
 
  /**
   * 手机号码校验
   */
  phoneNumber(value, callback) {
		if (!value) {
			return callback(false, '手机号码不符合规范');
		} else if (value && (!(/^[1][34578]\d{9}$/).test(value) || !(/^[1-9]\d*$/).test(value) || value.length !== 11)) {
      return callback(false, '手机号码不符合规范')
    } else {
      return callback(true)
    }
  },
	
	/**
	 * 数字验证码校验
	 */
	numberCode(value, length, callback) {
		if (value.length != length) {
			callback(false, '验证码不符合规范');
		} else if (!(/^[0-9]+$/).test(value)) {
		  callback(false, '验证码不符合规范')
		} else {
		  callback(true)
		}
	},
	
	/**
	 * 密码校验
	 */
	password(value, callback){
		if (value && !(/^[A-Za-z0-9]+$/).test(value)) {
		  callback(false, '只能填写英文或者数字')
		} else {
		  callback(true)
		}
	},
 
  /**
   * 电话号码校验
   */
  telephoneNumber(value, callback) {
    if (value && (!(/^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/).test(value))) {
      return callback(false, '电话号码不符合规范')
    } else {
      return callback(true)
    }
  },
 
  /**
   * 邮箱校验
   */
  emailValue(value, callback) {
    let temp = /^[\w.\-]+@(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,3}$/
    let tempOne = /^[A-Za-zd]+([-_.][A-Za-zd]+)*@([A-Za-zd]+[-.])+[A-Za-zd]{2,5}$/
    if (value && (!(temp).test(value))) {
      callback(false, '邮箱格式不符合规范')
    } else {
      callback(true)
    }
  },
 
  /**
   * 身份证号码校验
   */
  idCard(value, callback) {
    if (value && (!(/\d{17}[\d|x]|\d{15}/).test(value) || (value.length !== 15 && value.length !== 18))) {
      callback(false, '身份证号码不符合规范')
    } else {
      callback(true)
    }
  },
 
  /**
   * 正整数校验
   */
  integerP(value, callback) {
    if (value && !(/^[1-9]\d*$/).test(value)) {
      callback(false, '只能填写正整数')
    } else {
      callback(true)
    }
  },
 
  /**
   * 负整数校验
   */
  integerN(value, callback) {
    if (value && !(/^-[1-9]\d*$/).test(value)) {
      callback(false, '只能填写负整数')
    } else {
      callback(true)
    }
  },
 
  /**
   * 英文字符校验
   */
  enText(value, callback) {
    // let a = '',
    //   arr = value.split(" ")
    // for (let i = 0; i < arr.length; i++) { //删除行内空格
    //   a += arr[i];
    // }
    if (value && !(/^[A-Za-z]+$/).test(value)) {
      callback(false, '只能填写英文字符')
    } else {
      callback(true)
    }
  },
  /**
   * 中文字符英文字符校验
   */
  ChEnText(value, callback) {
    if (value && !(/^[A-Za-z0-9]+$/).test(value)) {
      callback(false, '只能填写数字和英文字符')
    } else {
      callback(true)
    }
  },
  /**
   * 中文字符校验
   */
  cnText(value, callback) {
    // let a = '',
    //   arr = value.split(" ")
    // for (let i = 0; i < arr.length; i++) { //删除行内空格
    //   a += arr[i];
    // }
    if (value && (/[^\u4e00-\u9fa5]/).test(value)) {
      callback(false, '只能填写中文字符')
    } else {
      callback(true)
    }
  },
  /**
   * 只能输入英文或者数字
   */
  enOrnunText (value, callback) {
    if (value && !(/^[A-Za-z0-9]+$/).test(value)) {
      callback(false, '只能填写英文或者数字')
    } else {
      callback(true)
    }
  },
  /**
   * 20位数字国标编码校验，且为正整数
   */
  validateDeviceNo (value, callback) {
    if (value && !(/^[1-9]\d*$/).test(value)) {
      callback(false, '只能填写正整数')
    } else {
      if (!/^[0-9]{20}$/.test(value)) {
        callback(false, '请输入20位数字的编码！');
      } else {
        callback(true);
      }
    }
  },
  /**
   *校验电脑Mac地址
   *以xx-xx-xx-xx-xx-xx的形式输入（xx为16进制数字）
   */
  validateMac (value, callback) {
    let temp = /[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}-[A-Fa-f0-9]{2}/;
    if (!temp.test(value)) {
      callback(false, '请输入xx-xx-xx-xx-xx-xx形式的MAC地址！');
    } else{
      callback(true);
    }
  },
  /**
   * 校验地址代码或者分组代码
   */
  validateCode (value, callback) {
    let num = /^[1-9]\d*$/
    if (value && !(num).test(value)) {
      callback(false, '只能填写正整数')
    } else {
      let codeLen = value.toString().length
      console.log(codeLen)
      if(codeLen > 0 && codeLen % 3 !== 0){
        callback(false, '输入的长度必须是3的倍数')
      }else if(codeLen>18){
        callback(false, '输入的长度不能超过18位,请重新输入')
      } else {
        callback(true)
      }
    }
  },
 
  /**
   * 校验字符长度
   */
  validateLength (value, callback) {
    let codeLen = value.toString().length
    if(codeLen>18){
      callback(false, '输入的长度不能超过20位,请重新输入')
    } else {
		callback(true)
	}
  },
 
  /**
   * 数字 ,两位
   */
  validateTwoNum (value, callback) {
    let temp = /^[1-9]{2}$/;
    if (!temp.test(value)) {
      callback(false, '请输入两位正整数！');
    } else{
      callback(true);
    }
  },
 
  /**
  * 校验经度是否符合规范
  * 
   */
  checkLongitude(value, callback) {
    let longrg = /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/;
    if(!longrg.test(value)){
      callback(false, '经度整数部分为0-180,小数部分为0到6位!');
    } else {
      callback(true);
    }
    },
 
 /**
  * 校验纬度是否符合规范
  */
  checkLatitude(value, callback) {
	  var latreg = /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/;
	   if(!latreg.test(value)){
		 callback(false, '纬度整数部分为0-90,小数部分为0到6位!');
	   } else {
		 callback(true);
	   }
	}
}

export {validater}