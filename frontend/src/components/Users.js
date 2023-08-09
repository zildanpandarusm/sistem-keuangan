import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenSquare, faTrashAlt, faX } from '@fortawesome/free-solid-svg-icons';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './css/modal.css';
import './css/style.css';

const Pengguna = () => {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [hapus, setHapus] = useState(false);
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [role, setRole] = useState('');
  const [file, setFile] = useState(null);
  const [idData, setIdData] = useState('');
  const [users, setUsers] = useState([]);
  const hasil = useSelector((state) => state.auth);

  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/users');
      setUsers(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getUserById = async (id) => {
    try {
      const response = await axios.get(`http://localhost:5000/users/${id}`);
      setNama(response.data.nama);
      setEmail(response.data.email);
      setRole(response.data.role);
      setFile(response.data.url);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/users/${idData}`);
      setIdData('');
      setShow(false);
      getUsers();
    } catch (error) {
      console.log(error);
    }
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!edit) {
      try {
        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confPassword', confPassword);
        formData.append('role', role);
        formData.append('foto', file);

        await axios.post('http://localhost:5000/users', formData);
        getUsers();
        setShow(false);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        const formData = new FormData();
        formData.append('nama', nama);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confPassword', confPassword);
        formData.append('role', role);
        formData.append('foto', file);

        await axios.patch(`http://localhost:5000/users/${idData}`, formData);
        getUsers();
        setShow(false);
        handleVariabel();
      } catch (error) {
        console.log(error);
      }
    }
  };

  const editModal = (id) => {
    setHapus(false);
    setShow(!show);
    setEdit(!edit);
    setIdData(id);
    getUserById(id);
  };

  const handleVariabel = () => {
    setIdData('');
    setNama('');
    setEmail('');
    setPassword('');
    setConfPassword('');
    setRole('');
    setFile(null);
    setEdit(false);
  };

  const deleteIcon = (id) => {
    setHapus(!hapus);
    setShow(!show);
    setIdData(id);
  };

  useEffect(() => {
    setTimeout(() => {
      getUsers();
    }, 500);
  }, []);

  const batalHapusModal = () => {
    setHapus(!hapus);
    setShow(!show);
  };

  const toggleModal = () => {
    setHapus(false);
    setShow(!show);
    handleVariabel();
  };

  useEffect(() => {
    setStyle();
    if (show) {
      const handleSilang = () => {
        if (!hapus) {
          const tandaX = document.querySelector('.box .tandaX');
          const box = document.querySelector('.modal.show .box');
          box.style.borderTopWidth = '3px';
          box.style.borderBottomWidth = '10px';
          box.style.minHeight = '20rem';
          box.style.top = '0';
          tandaX.addEventListener('mouseover', () => {
            box.style.borderColor = '#c3c3c3';
          });
          tandaX.addEventListener('mouseleave', () => {
            box.style.borderColor = '#53cdb1';
          });
        } else {
          const box = document.querySelector('.modal.show .box');
          box.style.borderWidth = '10px';
          box.style.minHeight = '30%';
          box.style.top = '-30%';
        }
      };
      handleSilang();
    }
  }, [show]);

  const setStyle = () => {
    const aside = document.querySelector('aside');
    const navbar = document.querySelector('.navbar');
    const modal = document.querySelector('.modal');
    if (show) {
      aside.style.zIndex = '-90';
      navbar.style.zIndex = '-100';
      modal.classList.add('show');
    } else {
      aside.style.zIndex = '10';
      navbar.style.zIndex = '5';
      modal.classList.remove('show');
    }
  };

  const data = useMemo(
    () =>
      users.map((item) => ({
        uuid: item.uuid,
        nama: item.nama,
        email: item.email,
        role: item.role,
        url: item.url,
      })),
    [users]
  );

  const columns = useMemo(
    () => [
      {
        Header: 'Nomor',
        accessor: 'nomor',
        Cell: ({ row }) => {
          return <div>{row.index + 1}</div>;
        },
      },
      {
        Header: 'Nama',
        accessor: 'nama',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Role',
        accessor: 'role',
      },
      {
        Header: 'Foto',
        accessor: 'url',
        Cell: ({ value }) => <img src={value} alt="Foto Profil" className="tblImg" />,
      },

      {
        Header: 'Aksi',
        Cell: ({ row }) => (
          <div className="aksi">
            <button className="edit" onClick={() => editModal(row.original.uuid)}>
              <FontAwesomeIcon icon={faPenSquare} />
            </button>
            <button className="hapus" onClick={() => deleteIcon(row.original.uuid)}>
              <FontAwesomeIcon icon={faTrashAlt} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    nextPage,
    previousPage,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 }, // Menentukan halaman awal dan ukuran halaman
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  return (
    <div className="pengguna">
      <div className="tambahPengguna">
        <div className="totPengg">
          <h4>Jumlah Pengguna:</h4>
          <p>{users.length} Orang</p>
        </div>
        <button onClick={toggleModal}>
          <FontAwesomeIcon className="icon" icon={faPlus} />
          <p>Tambah</p>
        </button>
      </div>
      <div className="tblKonten">
        <div className="table-controls">
          <label htmlFor="cari">Search : </label>
          <input type="text" value={globalFilter || ''} onChange={(e) => setGlobalFilter(e.target.value)} placeholder="Cari..." id="cari" />
        </div>
        <table className="tbl" {...getTableProps()} border="1">
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                    {column.render('Header')}
                    <span className="sorted">{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pgInfo">
          <span>
            Halaman{' '}
            <strong>
              {pageIndex + 1} dari {pageOptions.length}
            </strong>{' '}
          </span>
          <div className="pagination">
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
              Previous
            </button>

            <button onClick={() => nextPage()} disabled={!canNextPage}>
              Next
            </button>
          </div>
        </div>
      </div>

      <div className="modal">
        <div className="overlay">
          <div className="box">
            {!hapus ? (
              <>
                <div className="tandaX" onClick={toggleModal}>
                  <FontAwesomeIcon icon={faX} />
                </div>
                {edit ? <h2>Edit Pengguna</h2> : <h2>Tambah Pengguna</h2>}
                <form onSubmit={handleForm}>
                  <div className="formInput">
                    <label htmlFor="nama">Nama</label>
                    <input type="text" placeholder="Masukkan nama" id="nama" onChange={(e) => setNama(e.target.value)} value={nama} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="email">Email</label>
                    <input type="email" placeholder="Masukkan email" id="email" onChange={(e) => setEmail(e.target.value)} value={email} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="password">Password</label>

                    <input type="password" placeholder="Masukkan password" id="password" onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="confPassword">Konfirmasi Password</label>

                    <input type="password" placeholder="Masukkan konfirmasi password" id="confPassword" onChange={(e) => setConfPassword(e.target.value)} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="role">Role</label>
                    <select id="role" onChange={(e) => setRole(e.target.value)} value={role} required>
                      <option>Pilih Role</option>
                      <option value="admin">admin</option>
                      <option value="user">user</option>
                    </select>
                  </div>
                  <div className="formInput file">
                    <label htmlFor="foto">Foto</label>
                    {edit ? (
                      <div className="editFile">
                        <input type="file" id="foto" onChange={(e) => setFile(e.target.files[0])} /> <img src={file} alt="Foto Profil" width="30px" height="30px" />
                      </div>
                    ) : (
                      <input type="file" id="foto" onChange={(e) => setFile(e.target.files[0])} required />
                    )}
                  </div>
                  <div className="formButton">
                    {edit ? <button type="submit">Simpan</button> : <button type="submit">Tambah</button>}

                    <button type="button" onClick={toggleModal}>
                      Batal
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h2 className="yakin">Apakah Anda yakin ingin menghapus?</h2>
                <div className="hapusButton">
                  <button type="button" onClick={handleDelete}>
                    Hapus
                  </button>
                  <button type="button" onClick={batalHapusModal}>
                    Batal
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengguna;
