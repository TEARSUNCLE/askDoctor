import { defineComponent, reactive, ref } from "vue"
import styles from './css/index.module.less'
import hidePassword from '@/assets/images/icons/login/eye-off.svg'
import showPassword from '@/assets/images/icons/login/eye-on.svg'
import { showFailToast, showToast } from "vant"
import { accountLoginApi, codeLoginApi, getCodeApi } from "@/api/common"
import { codeLoginType } from "@/types/common"
import { useRouter } from "vue-router"
import useStore from "@/store"
import Navbar from "@/components/Navbar"

export default defineComponent({

  setup() {
    const defaultData: codeLoginType = reactive({
      mobile: '13230000048',
      password: '',
      code: ''
    })

    const isShowPassword = ref<boolean>(true)
    const isChecked = ref<boolean>(false)
    const accountLogin = ref<boolean>(true)
    const formRef = ref<any>(null)
    const codeTime = ref<number>(60)
    const curCode = ref()

    const router = useRouter()
    const { user } = useStore()

    const clickLeft = (type: string) => {
      console.log(32, type)
    }

    const sendCode = async () => {
      if (codeTime.value < 60) return false

      const reg = /^1[3456789]\d{9}$/
      if (!defaultData.mobile) {
        return showFailToast('请输入手机号')
      } else if (!reg.test(defaultData.mobile)) {
        return showFailToast('请输入正确的手机号')
      } else {
        const timer = setInterval(() => {
          if (codeTime.value <= 0) {
            clearInterval(timer)
            codeTime.value = 60
          } else {
            codeTime.value--
          }
        }, 1000)
        const params = {
          mobile: defaultData.mobile,
          type: 'login'
        }
        const { data } = await getCodeApi(params)
        if (data.code === 10000) {
          curCode.value = data.data.code
          showToast('已发送，请注意查收')
        }
      }
    }

    const submit = async () => {
      await formRef.value.validate()
      if (!isChecked.value) return showToast('请勾选我同意')
      if (!accountLogin.value && defaultData.code !== curCode.value) return showToast('验证码错误，请重试')

      const params = {
        ...defaultData
      }
      if (accountLogin.value) {
        delete params.code
      } else {
        delete params.password
      }
      const { data } = accountLogin.value ? await accountLoginApi(params) : await codeLoginApi(params)
      if (data.code === 10000) {
        router.push('/user')
        user.setUserInfo(data.data)
        showToast('登录成功')
      }
    }

    const toggleImg = () => {
      isShowPassword.value = !isShowPassword.value
    }

    const toggleStatus = () => {
      isChecked.value = !isChecked.value
    }

    const changeLogin = () => {
      accountLogin.value = !accountLogin.value
    }

    return {
      clickLeft,
      defaultData,
      submit,
      toggleImg,
      isShowPassword,
      isChecked,
      toggleStatus,
      formRef,
      accountLogin,
      changeLogin,
      sendCode,
      codeTime,
    }
  },

  render() {
    const {
      clickLeft,
      defaultData,
      submit,
      toggleImg,
      isShowPassword,
      isChecked,
      toggleStatus,
      accountLogin,
      changeLogin,
      sendCode,
      codeTime,
    } = this
    const patternMobile = /^1[3456789]\d{9}$/
    const patternPassword = /^[a-zA-Z0-9]{8,24}$/
    const patternCode = /^[0-9]\d{5}$/
    return (
      <div class={`${styles.loginBox}`}>
        <Navbar title="" isBack={false} v-slots={{
          leftText: () => (
            <>
              <div onClick={() => clickLeft('')}>
                <van-icon name="arrow-left" class='mt3' />
              </div>
            </>
          ),
          rightText: () => (
            <>
              <div onClick={() => clickLeft('register')}>注册</div>
            </>
          )
        }} />

        <div class='login-head flexBox flexBetweenX flexEndY pt25 pb25 pl30 pr30'>
          <h3 class='fs24 f400'>{accountLogin ? `密码登录` : `验证码登录`}</h3>
          <a href="javascript:;" class='block'>
            <span onClick={changeLogin}>{accountLogin ? `短信验证码登录` : `密码登录`}</span>
            <van-icon name="arrow" />
          </a>
        </div>

        <van-form label-width={0} class='mt25' validate-trigger='onBlur' ref="formRef">
          <van-cell-group inset>
            <van-field
              v-model={defaultData.mobile}
              name="mobile"
              label=""
              placeholder="请输入手机号"
              rules={[
                { required: true, message: '请输入手机号', trigget: 'blur' },
                { validator: (val) => patternMobile.test(val), message: '请输入正确的手机号' }
              ]}
            />
            {accountLogin ?
              <div>
                <van-field
                  v-model={defaultData.password}
                  type={isShowPassword ? 'password' : 'text'}
                  name="password"
                  label=""
                  placeholder="请输入密码"
                  rules={[
                    { required: true, message: '请输入密码', trigget: 'blur' },
                    { validator: (val) => patternPassword.test(val), message: '密码需8到24位(字母, 数字)字符' }
                  ]}
                  right-icon={isShowPassword ? hidePassword : showPassword}
                  onClickRightIcon={toggleImg}
                />
                <van-divider />
              </div> :
              <div>
                <div class='codeBox'>
                  <van-field
                    v-model={defaultData.code}
                    type='text'
                    name="code"
                    label=""
                    placeholder="请输入验证码"
                    rules={[
                      { required: true, message: '请输入验证码', trigget: 'blur' },
                      { validator: (val) => patternCode.test(val), message: '请输入正确的验证码' }
                    ]}
                  />
                  <a href="javascript:;" class='fs14 commonA sendCode' onClick={sendCode}>{codeTime === 60 ? '发送验证码' : codeTime + '秒后重试'}</a>
                </div>
                <van-divider />
              </div>
            }
          </van-cell-group>
        </van-form>

        <div class={`fs14 pl30 pr30 mb20`}>
          <van-checkbox checked={isChecked} onClick={toggleStatus} checked-color="#16c2a3" icon-size="14px">
            我已同意 <a href="javascript:;" class='commonA'>用户协议</a>
            及 <a href="javascript:;" class='commonA'>隐私条款</a>
          </van-checkbox>
        </div>

        <van-row justify="center">
          <van-col span={20}>
            <van-button round block type="primary" class='login' onClick={submit}>
              登 录
            </van-button>
          </van-col>
        </van-row>

        <p class='fs14 pl30 pt20'>
          <a href="javascript:;">忘记密码?</a>
        </p>

        <div class='login-other mt50'>
          <div class='textCenter'>
            <p class='fs14 c-999 pb20'>第三方登录</p>
            <img src="images/qq.svg" class='hand' alt="" width={38} height={38} />
          </div>
        </div>
      </div >
    )
  }
})