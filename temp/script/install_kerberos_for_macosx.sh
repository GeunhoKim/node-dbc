brew insatll wget
wget http://web.mit.edu/kerberos/dist/krb5/1.13/krb5-1.13-signed.tar
tar -xf krb5-1.13-signed.tar
tar -xzf krb5-1.13.tar.gz
cd krb5-1.13/src
./configure
make
sudo make install