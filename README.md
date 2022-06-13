# tattoo-server

{user ? (
<>
<Route path="/" element={<Home />}></Route>
<Route path="profile/:userId" element={<ProfilePage />}>
<Route path="products" element={<ProfilePage />}></Route>
<Route path="posts" element={<ProfilePage />}></Route>
<Route path="booking" element={<ProfilePage />}></Route>
<Route path="location" element={<ProfilePage />}></Route>
</Route>
<Route path="product/:productId" element={<Product />}></Route>
<Route path="checkout" element={<Checkout />}></Route>
<Route path="payment" element={<Payment />}></Route>
<Route path="paid" element={<Paid />}></Route>
{/_ </Route> _/}
<Route path="_" element={<Navigate to="/" />}></Route>
</>
) : (
<>
<Route path="/" element={<Home />}></Route>
<Route path="login" element={<Login />}></Route>
<Route path="register" element={<Register />}></Route>
<Route path="forget_password" element={<ForgetPass />}></Route>
<Route path="reset_password" element={<ResetPass />}></Route>
<Route path="product" element={<Product />}></Route>
{/_ </Route> \*/}

          <Route path="*" element={<Navigate to="/login" />}></Route>
        </>
      )}
