import React, { useMemo, useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faPenSquare, faTrashAlt, faX } from '@fortawesome/free-solid-svg-icons';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import { useSelector } from 'react-redux';
import axios from 'axios';
import './css/modal.css';
import './css/style.css';

const Karyawan = () => {
  const [show, setShow] = useState(false);
  const [edit, setEdit] = useState(false);
  const [hapus, setHapus] = useState(false);
  const [nama, setNama] = useState('');
  const [posisi, setPosisi] = useState('');
  const [alamat, setAlamat] = useState('');
  const [kontak, setKontak] = useState('');
  const [idData, setIdData] = useState('');
  const [karyawan, setKaryawan] = useState([]);
  const hasil = useSelector((state) => state.auth);

  useEffect(() => {
    getKaryawan();
  }, []);

  const getKaryawan = async () => {
    const response = await axios.get('http://localhost:5000/karyawan');
    setKaryawan(response.data);
  };

  const getKaryawanById = async (id) => {
    const response = await axios.get(`http://localhost:5000/karyawan/${id}`);
    setNama(response.data.nama);
    setPosisi(response.data.posisi);
    setAlamat(response.data.alamat);
    setKontak(response.data.kontak);
  };

  const handleDelete = async () => {
    await axios.delete(`http://localhost:5000/karyawan/${idData}`);
    setIdData('');
    setShow(false);
    getKaryawan();
  };

  const handleForm = async (e) => {
    e.preventDefault();
    if (!edit) {
      try {
        await axios.post('http://localhost:5000/karyawan', {
          nama: nama,
          posisi: posisi,
          alamat: alamat,
          kontak: kontak,
        });
        getKaryawan();
        setShow(false);
      } catch (error) {
        console.log(error.message);
      }
    } else {
      try {
        await axios.patch(`http://localhost:5000/karyawan/${idData}`, {
          nama: nama,
          posisi: posisi,
          alamat: alamat,
          kontak: kontak,
        });
        getKaryawan();
        setShow(false);
        handleVariabel();
      } catch (error) {}
    }
  };

  const editModal = (id) => {
    setHapus(false);
    setShow(!show);
    setEdit(!edit);
    setIdData(id);
    getKaryawanById(id);
  };

  const handleVariabel = () => {
    setIdData('');
    setNama('');
    setPosisi('');
    setAlamat('');
    setKontak('');
    setEdit(false);
  };

  const deleteIcon = (id) => {
    setHapus(!hapus);
    setShow(!show);
    setIdData(id);
  };

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
        if (hapus === false) {
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

  const data = useMemo(() => {
    return karyawan.map((item) => ({
      uuid: item.uuid,
      nama: item.nama,
      posisi: item.posisi,
      alamat: item.alamat,
      kontak: item.kontak,
    }));
  }, [karyawan]);

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
        Header: 'Posisi',
        accessor: 'posisi',
      },
      {
        Header: 'Alamat',
        accessor: 'alamat',
      },
      {
        Header: 'Kontak',
        accessor: 'kontak',
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
    <div className="karyawan">
      <div className="tambahKaryawan">
        <div className="totKar">
          <h4>Jumlah Karyawan:</h4>
          <p>{karyawan.length} Karyawan</p>
        </div>
        {hasil.user && hasil.user.role === 'admin' && (
          <button onClick={toggleModal}>
            <FontAwesomeIcon className="icon" icon={faPlus} />
            <p>Tambah</p>
          </button>
        )}
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
                {edit ? <h2>Edit Karyawan</h2> : <h2>Tambah Karyawan</h2>}
                <form onSubmit={handleForm}>
                  <div className="formInput">
                    <label htmlFor="nama">Nama</label>
                    <input type="text" placeholder="Masukkan nama" id="nama" onChange={(e) => setNama(e.target.value)} value={nama} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="posisi">Posisi</label>
                    <input type="text" placeholder="Masukkan posisi" id="posisi" onChange={(e) => setPosisi(e.target.value)} value={posisi} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="alamat">Alamat</label>
                    <input type="text" placeholder="Masukkan alamat" id="alamat" onChange={(e) => setAlamat(e.target.value)} value={alamat} required />
                  </div>
                  <div className="formInput">
                    <label htmlFor="kontak">Kontak</label>
                    <input type="text" placeholder="Masukkan kontak" id="kontak" onChange={(e) => setKontak(e.target.value)} value={kontak} required />
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

export default Karyawan;
