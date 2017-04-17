%define _binaries_in_noarch_packages_terminate_build 0

Summary: Trunks is a simple HTTP load testing tool with UI
Name:    trunks
Version: %(git describe --abbrev=0 --tags)
Release: 1
License: MIT
Group:   Applications/System
URL:     https://github.com/umatoma/trunks

Source0:   %{name}
Source1:   %{name}.initd
BuildRoot: %{_tmppath}/%{name}-%{version}-%{release}-root

%description
%{summary}

%prep

%build

%install
%{__rm} -rf %{buildroot}
mkdir -p %{buildroot}/usr/local/bin/
mkdir -p %{buildroot}/%{_initrddir}
%{__install} %{SOURCE0} %{buildroot}/usr/local/bin/%{name}
%{__install} %{SOURCE1} %{buildroot}/%{_initrddir}/%{name}

%clean
%{__rm} -rf %{buildroot}

%post
/sbin/chkconfig --add %{name}

%files
%defattr(-,root,root)
/usr/local/bin/%{name}
%{_initrddir}/%{name}
