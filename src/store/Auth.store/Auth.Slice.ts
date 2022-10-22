import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { config } from "../../providers";
import { auth } from "../../interface";

export const login = createAsyncThunk(
    "auth/login",
    async({email, password}:{email:string, password:string}, thunk)=>{
        
        try{
            const userInfo = await axios.post(`${config().baseurl}/api/session`, {
                email:email, 
                password:password
            })
           
            return userInfo.data
        }catch(e:any){
           
            return thunk.rejectWithValue(e.mesage)
        }
    }    
)

export const logout = createAsyncThunk(
    "auth/logout",
    async ({userId}:{userId:string}, thunk)=>{
        try{
          const res =   await axios.patch(`${config().baseurl}/api/logout`,{
            userId
          })
          console.log(res.data)
          return res.data
        }catch(e:any){
            return thunk.rejectWithValue(e.message)
        }
    }
)


const initialState:auth.authInterface = {
    userId:"",
    sessIn:0,
    sessExp:0,
    isAuth:false,
    role:"",
    loading:false,
    error:false
}


export const AuthSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{},
    extraReducers(builder) {
        builder.addCase(login.pending, (state, action)=>{
            state.error = false,
            state.loading = true
        })
        .addCase(login.rejected, (state, action)=>{
            state.error = true,
            state.loading = false
        })
        .addCase(login.fulfilled, (state, action:PayloadAction<any>)=>{
            
            state.error = false,
            state.loading = false,
            state.userId = action.payload.decoded.userId,
            state.sessIn =  action.payload.decoded.iat,
            state.sessExp = action.payload.decoded.exp,
            state.isAuth = true,
            state.role = ""
        })
        .addCase(logout.pending, (state, action)=>{
            
            state.error = false,
            state.loading = true
        }) 
        .addCase(logout.rejected, (state, action:PayloadAction<any>)=>{
            console.log(action)
            state.error = true,
            state.loading = false
        })
        .addCase(logout.fulfilled, (state, action:PayloadAction<any>)=>{
            
            state.error = false,
            state.loading = false,
            state.userId = "",
            state.sessIn =  0,
            state.sessExp = 0,
            state.isAuth = false,
            state.role = ""
        })
    }
})

export default AuthSlice.reducer